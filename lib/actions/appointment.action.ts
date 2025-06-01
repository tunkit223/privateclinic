'use server'

import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import Appointment, { IAppointment } from "@/database/appointment.model";
import dbConnect from "../mongoose";
import Patient from "@/database/patient.model";
import mongoose from "mongoose";
import MedicalReport from "@/database/medicalReport.modal";
import User from "@/database/user.model";
export const createAppointment = async (data: any) => {
  try {
    await dbConnect();

    // Chuyển patientId sang ObjectId
    const patientId =
      typeof data.patientId === "object"
        ? data.patientId._id
        : data.patientId;
    const patientObjectId = new mongoose.Types.ObjectId(patientId);

    // Kiểm tra bệnh nhân tồn tại
    const patient = await Patient.findById(patientObjectId);
    if (!patient) {
      throw new Error("Bệnh nhân không tồn tại.");
    }

    // Chuyển doctor sang ObjectId
    const doctorId =
      typeof data.doctor === "object"
        ? data.doctor._id
        : data.doctor;
    const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

    // (Tùy chọn) Kiểm tra bác sĩ có tồn tại không
    const doctor = await User.findById(doctorObjectId);
    if (!doctor) {
      throw new Error("Bác sĩ không tồn tại.");
    }

    // Tính khoảng thời gian của ngày đặt lịch
    const appointmentDate = new Date(data.date);
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Đếm số lịch hẹn chưa hủy trong ngày đó
    const count = await Appointment.countDocuments({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $ne: "cancelled" },
    });

    if (count >= 40) {
      throw new Error("Đã đủ 40 lịch hẹn hợp lệ trong ngày này. Vui lòng chọn ngày khác.");
    }

    // Tạo lịch hẹn mới
    const newAppointment = await Appointment.create({
      ...data,
      patientId: patientObjectId,
      doctor: doctorObjectId,
    });

    return {
      ...newAppointment.toObject(),
      _id: newAppointment._id.toString(),
      patientId: newAppointment.patientId.toString(),
      doctor: newAppointment.doctor.toString(),
      date: newAppointment.date.toISOString(),
    };
  } catch (error) {
    console.error("Lỗi khi tạo lịch hẹn:", error);
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
      confirmedCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };
    
    const counts = appointments.reduce((acc, appointment) => {
      switch (appointment.status) {
        case "confirmed":
          acc.confirmedCount += 1;
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

export const cancelAppointment = async (appointmentId: string, cancellationReason: string) => {
  try {
    await dbConnect();

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error("Cuộc hẹn không tồn tại");
    }
    if(appointment.status !== "pending"){
      throw new Error("Cuộc hẹn đã bị hủy hoặc kết thúc");
    }
    // Cập nhật trạng thái và lý do hủy
    appointment.status = "cancelled";
    appointment.cancellationReason = cancellationReason;
    await appointment.save();

    return { success: true, message: "Cuộc hẹn đã được hủy thành công" };
  } catch (error) {
    console.log({error})
  }
};

export async function getAppointmentDetails(appointmentId: string) {
  try {
    await dbConnect();

    const appointment = await Appointment.findById(appointmentId).populate('patientId');

    if (!appointment) return null;

    const patient = appointment.patientId as any;

    return {
      patientName: patient.name,
      appointmentDate: appointment.date,
    };
  } catch (err) {
    console.error('Error getting appointment details:', err);
    return null;
  }
}


export async function getAppointmentWithPatient(appointmentId: string) {
  try {
    await dbConnect()
    const appointment = await Appointment.findById(appointmentId).populate("patientId")

    if (!appointment) return null

    const patient = appointment.patientId

    return {
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      birthdate: patient.birthdate,
      gender: patient.gender,
      address: patient.address,
      doctor: appointment.doctor,
      date: appointment.date,
      reason: appointment.reason,
      note: appointment.note,
    }
  } catch (error) {
    console.error("Failed to get appointment:", error)
    return null
  }
}


export async function updateAppointmentAndPatient(appointmentId: string, values: any) {
  try {
    await dbConnect()

    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) return { error: "Appointment not found" }

    // Update patient
    const patient = await Patient.findById(appointment.patientId)
    if (!patient) return { error: "Patient not found" }

    patient.name = values.name
    patient.email = values.email
    patient.phone = values.phone
    patient.gender = values.gender
    patient.address = values.address
    patient.birthdate = values.birthdate
    await patient.save()

    // Update appointment
    appointment.doctor = values.doctor
    appointment.date = values.date
    appointment.reason = values.reason
    appointment.note = values.note
    await appointment.save()

    return { success: true }
  } catch (error) {
    console.error("Failed to update:", error)
    return { error: "Update failed" }
  }
}

export const ConfirmAppointment = async ({
  appointmentId,
}: {
  appointmentId: string;
}) => {
  try {
    await dbConnect();

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return { error: "Cuộc hẹn không tồn tại" };
    }

    if (appointment.status !== "pending") {
      return { error: "Cuộc hẹn đã bị hủy hoặc kết thúc" };
    }

    appointment.status = "confirmed";
    await appointment.save();

    const newMedicalReport = await MedicalReport.create({
      appointmentId: appointmentId,
      status: "unexamined",
    });
    
    return {
      _id: appointment._id.toString(),
    };
  } catch (error: any) {
    console.error("Lỗi xác nhận cuộc hẹn:", error);
    return { error: error.message || "Đã xảy ra lỗi không xác định" };
  }
};