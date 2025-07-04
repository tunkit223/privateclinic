"use client";

import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { from: "bot", text: data.answer }]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Toggle Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition-all duration-200"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? "×" : "💬"}
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 max-h-[500px] bg-white border border-gray-300 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          
          {/* Clear history button */}
          <div className="flex justify-end items-center px-3 py-2 border-b border-gray-200 relative">
            <button
              onClick={() => setMessages([])}
              className="text-gray-400 hover:text-red-500 text-[16px] font-bold transition-colors"
              aria-label="Clear history"
              title="Clear all chat history"
            >
              Delete history
            </button>
          </div>

          {/* Chat messages */}
          <div className="p-4 flex-1 overflow-y-auto bg-gray-50 space-y-3">
            {messages.length === 0 && (
              <p className="text-gray-500 text-sm text-center">
                You can ask me anything...
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[70%] text-sm whitespace-pre-wrap ${
                    msg.from === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input and send button */}
          <div className="p-3 border-t border-gray-200 bg-white flex gap-2">
            <input
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
