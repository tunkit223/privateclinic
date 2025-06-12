'use server'
import Account from "@/database/account.model";
import { cookies } from 'next/headers'
import dbConnect from "../mongoose";
import nodemailer from "nodemailer"
import { VerificationCode } from "@/database/VerificationCode";

export async function loginAccount(data: { email: string; password: string }) {
  try {
    const cookieStore = await cookies()
    await dbConnect();

    const account = await Account.findOne({ email: data.email });
    if (!account) {
      throw new Error("Email hoặc mật khẩu không chính xác!");
    }

    if (account.password !== data.password) {
      throw new Error("Email hoặc mật khẩu không chính xác!");
    }

    cookieStore.set("user", JSON.stringify({ email: account.email, tag: account.tag, _id: account._id.toString() }));
    return {
      _id: account._id.toString(), // Chuyển ObjectId thành string
      email: account.email,
      tag: account.tag,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi đăng nhập");
  }
}


export async function sendVerificationEmail(email: string) {
  if (!email) return { error: "Email is required" };
  console.log(process.env.EMAIL_USER)
  try {
    await dbConnect(); // Kết nối database

    // Tạo mã xác nhận ngẫu nhiên (6 chữ số)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Xóa mã cũ nếu có
    await VerificationCode.findOneAndDelete({ email });

    // Lưu mã vào database (hết hạn sau 5 phút)
    await VerificationCode.create({
      email: email,
      code: verificationCode,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    });

    // Cấu hình gửi email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Gửi email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: "Failed to send email" };
  }
}


export async function verifyCode(email: string, code: string) {
  if (!email || !code) return { error: "Email and code are required" };

  try {
    await dbConnect();

    // Tìm mã xác nhận trong database
    const record = await VerificationCode.findOne({ email });

    if (!record) return { error: "Code expired or invalid" };

    // Kiểm tra mã và hạn sử dụng
    if (record.code !== code) return { error: "Invalid code" };
    if (new Date() > record.expiresAt) return { error: "Code expired" };

    // Xóa mã sau khi xác nhận thành công
    await VerificationCode.deleteOne({ email });

    return { success: true };
  } catch (error) {
    console.error("Error verifying code:", error);
    return { error: "Verification failed" };
  }
}

export async function updatePassword(email: string, newPassword: string) {
  if (!email || !newPassword) {
    return { error: "Email and new password are required" };
  }

  try {
    await dbConnect();

    // Cập nhật mật khẩu trực tiếp
    const user = await Account.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { password: newPassword },
      { new: true }
    );

    if (!user) {
      return { error: "User not found" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    return { error: "Password update failed" };
  }
}