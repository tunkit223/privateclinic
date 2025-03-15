import mongoose, { Schema, model, models } from "mongoose";
export interface IVerificationCode{
  email:string,
  code: string,
  expiresAt:Date;
}

const VerificationCodeSchema = new Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true }, // Hết hạn sau 5 phút
});

export const VerificationCode =
  models?.VerificationCode || model<IVerificationCode>("VerificationCode", VerificationCodeSchema);
