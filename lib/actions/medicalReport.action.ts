"use server"
import MedicalReport, { IMedicalReport } from "@/database/medicalReport.modal";
import dbConnect from "../mongoose";
import { Types } from "mongoose";
import Appointment from "@/database/appointment.model";
import MedicalRPDetail from "@/database/medicalRPDetail.model";

export const addMedicalReport = async (data : any) =>{
  try {
    await dbConnect();
    const appointment = await Appointment.findById(data.appointmentId);
    if (!appointment) {
      throw new Error("Cuộc hẹn không tồn tại");
    }
    if(appointment.status !== "pending"){
      throw new Error("Cuộc hẹn đã bị hủy hoặc kết thúc");
    }
    appointment.status = "finished";
    await appointment.save();
    const appointmentId = new Types.ObjectId(data.appointmentId);

    const newMedicalReport = await MedicalReport.create({
      appointmentId: appointmentId,
      symptom: data.symptom,
      diseaseType: data.diseaseType,
    })
    return{
      _id: newMedicalReport._id.toString(),
    }
  } catch (error) {
    console.log(error)
  }
}


interface MedicalReportDetailInput {
  medicalReportId: string;
  medicineId: string;
  amount: number;
  usage?: string;
  price?: number;
}

export const addMedicalReportDetail = async (details: MedicalReportDetailInput[]) => {
  try {
    await dbConnect();

    await MedicalRPDetail.insertMany(details); 
    return { success: true }; 
  } catch (error) {
    console.error("Failed to add medical report details:", error);
    throw error;
  }
};