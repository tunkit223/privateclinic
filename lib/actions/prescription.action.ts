'use server'


import Prescription from "@/database/prescription.model";
import dbConnect from "../mongoose"
import PrescriptionDetail from "@/database/prescriptionDetail.model";
import MedicalReport from "@/database/medicalReport.modal";

export interface CreatePrescriptionPayload {
  medicalReportId: string;
  prescribeByDoctor?: string;
  details: {
    name: string;
    quantity: number;
    medicineId: string;
    unit: string;
    usage?: string;
    price?: number;
  }[];
}

export const getPrescriptionList = async () => {
  try {
    const prescription = await Prescription.find({ deleted: false })
      .populate({
        path: "medicalReportId",
        populate: {
          path: "appointmentId",
          populate: {
            path: "patientId",
            select: "name",
          },
        },
      })
      .populate({
        path: "prescribeByDoctor",
        select: "name",
      })
      .lean();

    const data = {
      documents: prescription,
    };
    return JSON.parse(JSON.stringify(data));

  } catch (error) {
    console.log("Error get prescription", error);
    return null;
  }
}

export const getPrescriptionById = async (prescriptionId: string) => {
  try {
    if (!prescriptionId) {
      console.log("Null prescriptionId");
      return null;
    }
    const prescription = await Prescription.findById(prescriptionId)
      .populate({
        path: "medicalReportId",
        populate: {
          path: "appointmentId",
          populate: {
            path: "patientId",
            select: "name",
          },
        },
      })
      .populate({
        path: "prescribeByDoctor",
        select: "name",
      })
      .lean();
    if (!prescription) {
      console.log("Prescription find id error");
      return null;
    }
    return JSON.parse(JSON.stringify(prescription));

  } catch (error) {
    console.log("Error get prescription by Id", prescriptionId);
  }
}

export const getPrescriptionDetailsById = async (prescriptionId: string) => {
  try {
    const details = await PrescriptionDetail.find({ prescriptionId })
      .lean();
    if (!details) {
      console.log("Details null");
      return null;
    }
    return JSON.parse(JSON.stringify(details));
  } catch (error) {
    console.log("Get prescription details by Id", error)
  }
}
export const createPrescription = async ({
  medicalReportId,
  prescribeByDoctor = "Unknown Doctor",
  details,
}: CreatePrescriptionPayload) => {
  try {
    console.log("Bắt đầu tạo prescription với medicalReportId:", medicalReportId);

    await dbConnect();
    console.log("Đã kết nối cơ sở dữ liệu");

    // const newPrescription = await Prescription.create({
    //   medicalReportId,
    // })
    const newPrescription = new Prescription({
      medicalReportId,
      prescribeByDoctor,
    });
    console.log("Prescription trước khi lưu:", newPrescription.toObject());

    await newPrescription.save();
    console.log("Prescription sau khi lưu lần đầu:", newPrescription.toObject());


    const detailPrescription = details.map((detail) => ({
      ...detail,
      prescriptionId: newPrescription._id,
    }));
    await PrescriptionDetail.insertMany(detailPrescription);


    const totalPrice = details.reduce((sum, item) => {
      const itemTotal = (item.price || 0) * item.quantity;
      return sum + itemTotal;
    }, 0)


    // update totalPrice;
    newPrescription.totalPrice = totalPrice;
    await newPrescription.save();
    console.log("Prescription sau khi lưu lần thứ hai:", newPrescription.toObject());


    return {
      ...newPrescription.toObject(),
      _id: newPrescription._id.toString(),
      code: newPrescription.code,
      medicalReportId: newPrescription.medicalReportId.toString(),

    }
  } catch (error) {
    console.log("Create prescription:", error)
  }
}

export const getPatientExaminedList = async () => {
  try {
    const medicalReportExamined = await MedicalReport.find({ status: "examined" })
      .populate({
        path: "appointmentId",
        populate: {
          path: "patientId",
          select: "name",
        }
      })
    const formatted = medicalReportExamined.map((item: any) => ({
      medicalReportId: item._id,
      patientId: item.appointmentId.patientId._id,
      name: item.appointmentId.patientId.name,
    }))

    return JSON.parse(JSON.stringify(formatted));
  } catch (error) {
    console.log("Error get patient examined list", error);
    return null;
  }
}

export const UpdatePrescriptionStatus = async (prescriptionId: string, isPaid: boolean) => {
  try {
    await dbConnect();
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      throw new Error("Prescription not found");
    }
    console.log("id", prescriptionId);
    console.log("status action:", isPaid);
    prescription.isPaid = isPaid;
    await prescription.save();
  } catch (error) {
    console.log("Error set status paid:", error);
    throw error;
  }
}
