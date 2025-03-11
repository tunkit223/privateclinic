'use server'
import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import Appointment, { IAppointment } from "@/database/appointment.model";
import dbConnect from "../mongoose";
import Patient from "@/database/patient.model";

export const createAppointment = async (data: IAppointment) => {
  try {
    await dbConnect();
    console.log('createapp')
    // Kiểm tra xem bệnh nhân có tồn tại không
    const patient = await Patient.findById(data.patientId);
    if (!patient) {
      throw new Error("Bệnh nhân không tồn tại.");
    }

    // Tạo lịch hẹn mới
    const newAppointment = await Appointment.create({
      patientId: data.patientId,
      doctor: data.doctor,
      date: data.date,
      reason: data.reason,
      note: data.note,
    });

    return {
      ...newAppointment.toObject(),
      _id: newAppointment._id.toString(), // Chuyển ObjectId sang string
    };
  } catch (error) {
    throw error;
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await Appointment.findById(appointmentId).lean();
    
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    return JSON.parse(JSON.stringify(appointment));
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return null;
  }
  
}

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .lean();
    
    const initialCounts = {
      finishedCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };
    
    const counts = appointments.reduce((acc, appointment) => {
      switch (appointment.status) {
        case "finished":
          acc.finishedCount += 1;
          break;
        case "pending":
          acc.pendingCount += 1;
          break;
        case "cancelled":
          acc.cancelledCount += 1;
          break;
      }
      return acc;
    }, initialCounts);
    
    const data = {
      totalCount: appointments.length,
      ...counts,
      documents: appointments,
    };
    
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching recent appointments:", error);
    return null;
  }
};


export const updateAppointment = async ({appointmentId, userId, appointment, type}: UpdateAppointmentParams) =>{
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    )
    if(!updatedAppointment){
      throw new Error("Appointment not found");
    }
    //Todo sms notification
    revalidatePath('/appointment')
    return parseStringify(updatedAppointment)
  } catch (error) {
    console.log(error);
  }
}