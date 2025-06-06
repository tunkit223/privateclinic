'use server'

import Setting from "@/database/setting.model"
import dbConnect from "../mongoose";

export async function createSetting(data: { MaxPatientperDay: number; ExamineFee: number }) {
  try {
    await dbConnect()
    const newSetting = await Setting.create(data)
    if (!newSetting) {
      return { success: false, message: "Không thể tạo cài đặt." }
    }
    return { success: true}
  } catch (error) {
    console.error("Error creating setting:", error)
    return { success: false, message: "Lỗi khi tạo cài đặt." }
  }
}
