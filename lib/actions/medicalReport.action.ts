"use server"
import MedicalReport, { IMedicalReport } from "@/database/medicalReport.modal";
import dbConnect from "../mongoose";
import { Types } from "mongoose";
import Appointment from "@/database/appointment.model";
import MedicalRPDetail from "@/database/prescriptionDetail.model";

export const addMedicalReport = async (data: any) => {
  try {
    await dbConnect();
    const appointment = await Appointment.findById(data.appointmentId);
    if (!appointment) {
      throw new Error("Cuộc hẹn không tồn tại");
    }
    if (appointment.status !== "pending") {
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
    return {
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

    if (!details || details.length === 0) {
      return { success: false, message: "Danh sách chi tiết rỗng." };
    }

    const medicalReportId = details[0].medicalReportId;


    await MedicalRPDetail.deleteMany({ medicalReportId });


    await MedicalRPDetail.insertMany(details);

    return { success: true };
  } catch (error) {
    console.error("Failed to add medical report details:", error);
    throw error;
  }
};


export const getMedicalReportList = async () => {
  try {
    await dbConnect();
    const MedicalReports = await MedicalReport.find()
      .sort({ createdAt: -1 })
      .lean();

    const data = {
      documents: MedicalReports,
    };

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching MedicalReports:", error);
    return null;
  }
};

export const getAllMedicalReports = async () => {
  try {
    await dbConnect();

    const reports = await MedicalReport.find({ deleted: { $ne: true } })
      .populate({
        path: "appointmentId",
        populate: {
          path: "patientId",
          model: "Patient",
        },
      })
      .lean();

    return JSON.parse(JSON.stringify(reports));
  } catch (error) {
    console.error("Error fetching medical reports:", error);
    return [];
  }
};


export const examiningMedicalReport = async (data: any) => {
  try {
    await dbConnect();
    const medicalReport = await MedicalReport.findById(data.medicalreportId);
    if (!medicalReport) {
      throw new Error("Phiếu khám không tồn tại");
    }
    medicalReport.status = "examining";
    await medicalReport.save();
    return {
      _id: medicalReport._id.toString(),
    };
  } catch (error) {
    console.log(error);
  }
};



export const ExaminedMedicalReport = async (data: any) => {
  try {
    await dbConnect();
    const medicalReport = await MedicalReport.findById(data.medicalreportId);
    if (!medicalReport) {
      throw new Error("Phiếu khám không tồn tại");
    }
    medicalReport.status = "examined";
    if (!medicalReport.examinationDate) {
      medicalReport.examinationDate = new Date();
    }
    await medicalReport.save();
    return {
      _id: medicalReport._id.toString(),
    };
  } catch (error) {
    console.log(error);
  }
};


export async function getMedicalReportDetails(medicalReportId: string) {
  try {
    await dbConnect();

    const medicalReport = await MedicalReport.findById(medicalReportId);

    if (!medicalReport) return null;

    return {
      symptom: medicalReport.symptom,
      diseaseType: medicalReport.diseaseType,
    };
  } catch (err) {
    console.error('Error getting medical report details:', err);
    return null;
  }
}

export const updateMedicalReport = async (id: string, symptom: string, diseaseType: string) => {
  try {

    await dbConnect();
    const update = await MedicalReport.findByIdAndUpdate(id, {
      $set: {
        symptom: symptom,
        diseaseType: diseaseType
      }
    })
    if (!update) {
      throw new Error("Medical report not found");
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getExamHistoryByPatientId = async (patientId: string) => {
  try {
    await dbConnect()

    const medicalReports = await MedicalReport.find({ status: 'examined' })
    .populate({
      path: 'appointmentId',
      match: { patientId: patientId }, 
      populate: {
        path: 'patientId',
      },
    })
    .lean()

  const filteredReports = medicalReports.filter((r) => r.appointmentId)
    return JSON.parse(JSON.stringify(filteredReports)) 
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử khám (đã khám):", error)
    return []
  }
}


export const deleteMedicalReport = async (medicalReportId: string) => {
  try {
    await MedicalReport.findByIdAndUpdate(medicalReportId, {
      deleted: true,
      deletedAt: new Date(),
    });

    return {
      success: true,
      message: "Medical report deleted successfully.",
    };
  } catch (error: any) {
    console.error("Error deleting medical report:", error);
    return {
      success: false,
      message: error.message || "Failed to delete medical report.",
    };
  }
};