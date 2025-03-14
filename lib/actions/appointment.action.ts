'use server'

import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import Appointment, { IAppointment } from "@/database/appointment.model";
import dbConnect from "../mongoose";
import Patient from "@/database/patient.model";
import mongoose from "mongoose"; 
export const createAppointment = async (data: IAppointment) => {
  try {
    await dbConnect();
    console.log("createAppointment");
    const patientIdString = typeof data.patientId === "object" ? data.patientId._id : data.patientId;
    const patientIdObject = new mongoose.Types.ObjectId(patientIdString)
    
    const patient = await Patient.findById(patientIdObject);
    if (!patient) {
      throw new Error("Bệnh nhân không tồn tại.");
    }


    const newAppointment = await Appointment.create(data);


    return JSON.parse(
      JSON.stringify({
        ...newAppointment.toObject(),
        _id: newAppointment._id.toString(),
        patientId: newAppointment.patientId.toString(),
        date: newAppointment.date.toISOString(), 
      })
    );
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
      .populate("patientId", "name")
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


export const updateAppointment = async ({ appointmentId, appointment }: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: appointment },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    // TODO: Thêm logic gửi SMS notification nếu cần

    revalidatePath('/appointment'); // Cập nhật lại trang appointment
    return JSON.parse(JSON.stringify(updatedAppointment)); // Chuyển đổi dữ liệu để đảm bảo tương thích
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw new Error("Failed to update appointment");
  }
};