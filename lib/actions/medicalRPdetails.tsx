'use server'

import MedicalRPDetail from "@/database/medicalRPDetail.model";
import dbConnect from "../mongoose";
import { Types } from "mongoose";
import Medicine from "@/database/medicine";
export const getMedicalReportDetailsList = async (medicalReportId: string) => {
  try {
    await dbConnect();

    const details = await MedicalRPDetail.find({ medicalReportId })
      .populate("medicineId", "name")
      .lean();

    if (!details || details.length === 0) return null;

    return details.map((item) => {
      const medicine = item.medicineId as { _id: Types.ObjectId; name: string };

      return {
        medicineName: medicine?.name || "Không rõ",
        medicineId: medicine?._id?.toString() || "",
        amount: item.amount,
        unit: item.unit,
        usage: item.usage || "",
        price: item.price || 0,
      };
    });
  } catch (error) {
    console.error("Lỗi khi lấy medical report details:", error);
    return null;
  }
};