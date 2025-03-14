'use server'
import Account from "@/database/account.modal";
import dbConnect from "../mongoose";

export async function loginAccount(data: { email: string; password: string }) {
  try {
    await dbConnect();

    // 🔹 Tìm account theo email
    const account = await Account.findOne({ email: data.email });
    if (!account) {
      throw new Error("Email hoặc mật khẩu không chính xác!");
    }

    // 🔹 So sánh password (KHÔNG dùng bcrypt)
    if (account.password !== data.password) {
      throw new Error("Email hoặc mật khẩu không chính xác!");
    }

    // 🔹 Trả về user nếu đúng
    return {
      _id: account._id.toString(), // Chuyển ObjectId thành string
      email: account.email,
      tag: account.tag, // Thêm thông tin nếu cần
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi đăng nhập");
  }
}
