import Counter from "@/database/counter.model";
import { Document } from "mongoose";

/**
 * Middleware auto generate code, example: Rx000001 for schema has field code
 * @param prefix Prefix for code, example: Rx
 * @param counterId, name of counter, example: prescription
 */

export function autoGenerateCode(prefix: string, counterId: string) {
  return async function (this: Document & { code: string }, next: (err?: any) => void) {
    if (!this.isNew || this.code) {
      console.log("Bỏ qua autoGenerateCode: tài liệu không phải mới hoặc đã có code");

      return next()
    };

    try {
      console.log(`Bắt đầu tạo code với prefix: ${prefix}, counterId: ${counterId}`);

      const counter = await Counter.findByIdAndUpdate(
        { _id: counterId },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      if (!counter) {
        throw new Error(`Không tìm thấy hoặc không thể tạo counter với _id: ${counterId}`);
      }
      this.code = prefix + String(counter.seq).padStart(6, "0");
      console.log(`Đã gán code: ${this.code}`);

      next();

    } catch (error) {
      console.error("Lỗi trong autoGenerateCode:", error);
      next(error);
    }
  }
}