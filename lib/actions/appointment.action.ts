'use server'

import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import Appointment, { IAppointment } from "@/database/appointment.model";
import dbConnect from "../mongoose";
import Patient from "@/database/patient.model";
import mongoose from "mongoose";
import MedicalReport from "@/database/medicalReport.modal";
import User from "@/database/user.model";
import Setting from "@/database/setting.model";
import { startOfDay, endOfDay } from "date-fns"
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
    const latestSetting = await Setting.findOne().sort({ createdAt: -1 });
    const maxPatientPerDay = latestSetting?.MaxPatientperDay ?? 40; // fallback nếu chưa có Setting

    // Đếm số lịch hẹn chưa hủy trong ngày đó
    const count = await Appointment.countDocuments({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $ne: "cancelled" },
    });
    console.log("Appointments on date:", await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "cancelled" },
    }));
    if (count >= maxPatientPerDay) {
      throw new Error("Đã đủ lịch hẹn hợp lệ trong ngày này. Vui lòng chọn ngày khác.");
    }
    const hour = appointmentDate.getHours();
    const isMorning = hour < 13;

    // Tạo khoảng thời gian của buổi
    const sessionStart = new Date(appointmentDate);
    const sessionEnd = new Date(appointmentDate);

    if (isMorning) {
      sessionStart.setHours(7, 0, 0, 0);
      sessionEnd.setHours(12, 59, 59, 999);
    } else {
      sessionStart.setHours(13, 0, 0, 0);
      sessionEnd.setHours(18, 0, 0, 0); // hoặc 23, 59 nếu bạn cho phép trễ hơn
    }

    // Kiểm tra xem bệnh nhân đã đặt trong buổi này chưa
    const existingAppointment = await Appointment.findOne({
      patientId: patientObjectId,
      date: { $gte: sessionStart, $lte: sessionEnd },
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      const buoi = isMorning ? "sáng" : "chiều";
      const formattedDate = appointmentDate.toLocaleDateString("vi-VN");
      throw new Error(`Bạn đã đặt lịch buổi ${buoi} ngày ${formattedDate} rồi.`);
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
    const appointments = await Appointment.find({ deleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .populate("patientId", "name")
      .populate("doctor", "name")
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
    if (appointment.status !== "pending") {
      throw new Error("Cuộc hẹn đã bị hủy hoặc kết thúc");
    }
    // Cập nhật trạng thái và lý do hủy
    appointment.status = "cancelled";
    appointment.cancellationReason = cancellationReason;
    await appointment.save();

    return { success: true, message: "Cuộc hẹn đã được hủy thành công" };
  } catch (error) {
    console.log({ error })
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
    const appointment = await Appointment.findById(appointmentId).populate("patientId");

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
    await dbConnect();

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return { success: false, error: "Appointment not found." };

    const patient = await Patient.findById(appointment.patientId);
    if (!patient)
      return { success: false, error: "Patient not found." };

    // Update patient info
    patient.name = values.name;
    patient.email = values.email;
    patient.phone = values.phone;
    patient.gender = values.gender;
    patient.address = values.address;
    patient.birthdate = values.birthdate;
    await patient.save();

    // Check if appointment date/time changed
    const newDate = new Date(values.date);
    const isDateChanged = newDate.getTime() !== new Date(appointment.date).getTime();

    if (isDateChanged) {
      const hour = newDate.getHours();
      const isMorning = hour < 13;
      const sessionStart = new Date(newDate);
      const sessionEnd = new Date(newDate);

      if (isMorning) {
        sessionStart.setHours(7, 0, 0, 0);
        sessionEnd.setHours(12, 59, 59, 999);
      } else {
        sessionStart.setHours(13, 0, 0, 0);
        sessionEnd.setHours(18, 0, 0, 0);
      }

      const existingAppointment = await Appointment.findOne({
        _id: { $ne: appointment._id },
        patientId: appointment.patientId,
        date: { $gte: sessionStart, $lte: sessionEnd },
        status: { $ne: "cancelled" },
      });

      if (existingAppointment) {
        const session = isMorning ? "morning" : "afternoon";
        const formatted = newDate.toLocaleDateString("en-GB");
        return {
          success: false,
          error: `The patient already has an appointment in the ${session} on ${formatted}.`,
        };
      }
    }

    // Update appointment info
    appointment.doctor = values.doctor;
    appointment.date = newDate;
    appointment.reason = values.reason;
    appointment.note = values.note;
    await appointment.save();

    return { success: true };
  } catch (error: any) {
    console.error("Error while updating appointment:", error);
    return {
      success: false,
      error: error?.message || "Failed to update appointment.",
    };
  }
}

export async function CreateAppointmentAndPatient(values: {
  patientId: string;
  doctor: string;
  date: Date;
  reason?: string;
  note?: string;
}) {
  try {
    await dbConnect();

    const patientObjectId = new mongoose.Types.ObjectId(values.patientId);
    const patient = await Patient.findById(patientObjectId);
    if (!patient)
      return { success: false, error: "Patient does not exist." };

    const doctorObjectId = new mongoose.Types.ObjectId(values.doctor);
    const doctor = await User.findById(doctorObjectId);
    if (!doctor)
      return { success: false, error: "Doctor does not exist." };

    const appointmentDate = new Date(values.date);
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const latestSetting = await Setting.findOne().sort({ createdAt: -1 });
    const maxPerDay = latestSetting?.MaxPatientperDay ?? 40;

    const count = await Appointment.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "cancelled" },
    });

    if (count >= maxPerDay) {
      return {
        success: false,
        error:
          "The maximum number of appointments for this day has been reached. Please choose another date.",
      };
    }

    const hour = appointmentDate.getHours();
    const isMorning = hour < 13;
    const sessionStart = new Date(appointmentDate);
    const sessionEnd = new Date(appointmentDate);

    if (isMorning) {
      sessionStart.setHours(7, 0, 0, 0);
      sessionEnd.setHours(12, 59, 59, 999);
    } else {
      sessionStart.setHours(13, 0, 0, 0);
      sessionEnd.setHours(18, 0, 0, 0);
    }

    const existingAppointment = await Appointment.findOne({
      patientId: patientObjectId,
      date: { $gte: sessionStart, $lte: sessionEnd },
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      const session = isMorning ? "morning" : "afternoon";
      const dateEN = appointmentDate.toLocaleDateString("en-GB");
      return {
        success: false,
        error: `You already have an appointment in the ${session} on ${dateEN}.`,
      };
    }

    const newAppointment = new Appointment({
      patientId: patientObjectId,
      doctor: doctorObjectId,
      date: appointmentDate,
      reason: values.reason,
      note: values.note,
      status: "pending",
    });

    await newAppointment.save();

    return {
      success: true,
      appointmentId: newAppointment._id.toString(),
    };
  } catch (error: any) {
    console.error("Failed to create appointment:", error);
    return {
      success: false,
      error:
        error?.message ??
        "An unknown error occurred while creating the appointment.",
    };
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

export const getAppointmentStatsByDate = async (
  filterType: "today" | "all" | "custom",
  selectedDate?: string
) => {
  let matchCondition = {}

  if (filterType === "today") {
    const today = new Date()
    matchCondition = {
      date: {
        $gte: startOfDay(today),
        $lte: endOfDay(today),
      },
    }
  } else if (filterType === "custom" && selectedDate) {
    const date = new Date(selectedDate)
    matchCondition = {
      date: {
        $gte: startOfDay(date),
        $lte: endOfDay(date),
      },
    }
  }

  const result = await Appointment.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ])

  // Chuyển kết quả từ dạng [{_id: "confirmed", count: 3}, ...] sang object dễ dùng
  const stats = {
    confirmedCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
  }

  result.forEach(item => {
    const status = item._id?.toLowerCase()
    if (status === "confirmed") stats.confirmedCount = item.count
    if (status === "pending") stats.pendingCount = item.count
    if (status === "cancelled") stats.cancelledCount = item.count
  })

  return stats
}


export async function cancelAppointmentsByDoctorDateShift({
  doctorId,
  date,
  shift,
}: {
  doctorId: string;
  date: string | Date;
  shift: "Morning" | "Afternoon";
}) {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const nextDate = new Date(targetDate);
  nextDate.setDate(targetDate.getDate() + 1);

  await Appointment.updateMany(
    {
      doctor: doctorId,
      date: {
        $gte: targetDate,
        $lt: nextDate,
      },
      shift,
      status: "pending",
    },
    { $set: { status: "cancel" } }
  );
}


export const deleteAppointment = async (appointmentId: string) => {
  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return { success: false, message: "Appointment not found." };
    }

    const status = appointment.status;

    if (status === "pending" || status === "cancelled") {
      await Appointment.findByIdAndUpdate(appointmentId, {
        deleted: true,
        deletedAt: new Date(),
      });
      return { success: true, message: "Appointment deleted successfully." };
    }

    if (status === "confirmed") {
      const medicalReport = await MedicalReport.findOne({
        appointmentId: new mongoose.Types.ObjectId(appointmentId),
      });

      if (!medicalReport) {
        return {
          success: false,
          message: "Medical report related to this appointment not found.",
        };
      }

      if (medicalReport.status === "unexamined") {
        await Promise.all([
          Appointment.findByIdAndUpdate(appointmentId, {
            deleted: true,
            deletedAt: new Date(),
          }),
          MedicalReport.findByIdAndUpdate(medicalReport._id, {
            deleted: true,
            deletedAt: new Date(),
          }),
        ]);
        return {
          success: true,
          message: "Appointment and unexamined medical report deleted successfully.",
        };
      } else {
        return {
          success: false,
          message: "Cannot delete appointment with completed medical report.",
        };
      }
    }

    return {
      success: false,
      message: "Cannot delete appointment with the current status.",
    };
  } catch (error: any) {
    console.error("Error deleting appointment:", error);
    return {
      success: false,
      message: "An error occurred while deleting the appointment.",
    };
  }
};