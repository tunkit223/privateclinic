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
