import fs from "fs";
import path from "path";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Ollama } from "@langchain/community/llms/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { loadQARefineChain } from "langchain/chains";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { PromptTemplate } from "@langchain/core/prompts";

let vectorStorePromise: Promise<MemoryVectorStore> | null = null;
let qaList: { question: string; answer: string }[] = [];

// Tải và vector hóa dữ liệu từ JSON
async function loadVectorStore() {
  const jsonPath = path.join(process.cwd(), "data", "faq.json");
  const rawJson = fs.readFileSync(jsonPath, "utf8");
  qaList = JSON.parse(rawJson);

  const documents = qaList.map(({ question, answer }) => ({
    pageContent: `Câu hỏi: ${question}\nTrả lời: ${answer}`,
    metadata: { question },
  }));

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const splitDocs = await splitter.splitDocuments(documents);

  const embeddings = new OllamaEmbeddings({ model: "mistral" });
  return await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
}

export async function askBot(userQuestion: string): Promise<string> {
  try {
    if (!vectorStorePromise) {
      vectorStorePromise = loadVectorStore();
    }

    const vectorStore = await vectorStorePromise;

    // ✅ 1. Kiểm tra nếu câu hỏi trùng 100% (bỏ qua viết hoa, khoảng trắng)
    const exactMatch = qaList.find(
      (qa) =>
        qa.question.trim().toLowerCase() === userQuestion.trim().toLowerCase()
    );
    if (exactMatch) {
      return exactMatch.answer;
    }

    // 🤖 2. Nếu không trùng, dùng AI để tìm câu trả lời gần đúng
    const relevantDocs = await vectorStore.similaritySearch(userQuestion, 3);
    const model = new Ollama({ model: "mistral", temperature: 0.2 });

    const prompt = PromptTemplate.fromTemplate(`
Bạn là một trợ lý tư vấn y tế chuyên nghiệp của phòng khám tư nhân.
Dưới đây là một số thông tin tài liệu:
{context}

Câu hỏi: {question}

Vui lòng trả lời ngắn gọn, rõ ràng và luôn bằng **tiếng Việt**. Nếu không tìm thấy thông tin trong tài liệu, hãy lịch sự nói rằng bạn không biết.
    `);

    const refinePrompt = PromptTemplate.fromTemplate(`
Bạn đang cải thiện câu trả lời dựa trên tài liệu sau:
{context}

Câu trả lời ban đầu: {existing_answer}

Câu hỏi: {question}

Hãy sửa câu trả lời nếu cần, chỉ dựa trên thông tin đã cung cấp. Luôn trả lời bằng **tiếng Việt**.
    `);

    const chain = loadQARefineChain(model, {
      questionPrompt: prompt,
      refinePrompt: refinePrompt,
    });

    const result = await chain.call({
      input_documents: relevantDocs,
      question: userQuestion,
    });

    return result.output_text;
  } catch (err) {
    console.error("Lỗi khi gọi askBot:", err);
    return "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.";
  }
}
