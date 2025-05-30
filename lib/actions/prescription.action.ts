'use server'


import Prescription from "@/database/prescription.model";
import dbConnect from "../mongoose"
import PrescriptionDetail from "@/database/prescriptionDetail.model";
import MedicalReport from "@/database/medicalReport.modal";
import { Create_EditPrescriptionPayload } from '@/lib/interfaces/create_editPrescriptionPayload.interface';
import { ObjectId } from "mongodb";




export const getPrescriptionList = async () => {
  try {
    await dbConnect();
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
    const details = await PrescriptionDetail.find({ prescriptionId, })
      .populate({
        path: "usageMethodId",
        select: "name"
      })
      .populate({
        path: "medicineId",
        select: "name unit price"
      })
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
}: Create_EditPrescriptionPayload) => {
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


    // console.log(details);
    const totalPrice = details.reduce((sum, item) => {
      const itemTotal = (item.price || 0) * item.quantity;
      return sum + itemTotal;
    }, 0)


    // update totalPrice;
    newPrescription.totalPrice = totalPrice;
    await newPrescription.save();
    console.log("Prescription sau khi lưu lần thứ hai:", newPrescription.toObject());


    return {
      _id: newPrescription._id.toString(),
      medicalReportId: newPrescription.medicalReportId.toString(),
      isPaid: newPrescription.isPaid,
      deleted: newPrescription.deleted,
      deletedAt: newPrescription.deletedAt?.toISOString() || null,
      createdAt: newPrescription.createdAt.toISOString(),
      updatedAt: newPrescription.updatedAt.toISOString(),
      code: newPrescription.code,
      totalPrice: newPrescription.totalPrice,
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

export const UpdatePrescription = async (prescriptionId: string, payload: Create_EditPrescriptionPayload) => {
  // Session use to avoid inadequately update data
  const session = await Prescription.startSession();
  session.startTransaction();
  try {
    // Update general information of prescription
    await Prescription.updateOne(
      { _id: new ObjectId(prescriptionId) },
      {
        $set: {
          medicalReportId: new ObjectId(payload.medicalReportId),
          prescribeByDoctor: new ObjectId(payload.prescribeByDoctor),
          updatedAt: new Date(),
        }
      },
      { session }
    );

    // ============== Update prescription details =============
    // 1. Delete all old prescription details
    await PrescriptionDetail.deleteMany({ prescriptionId: new ObjectId(prescriptionId) }, { session });

    // 2. Re-add list prescription details
    const newDetails = payload.details.map(dt => ({
      medicineId: new ObjectId(dt.medicineId),
      prescriptionId: new ObjectId(prescriptionId),
      quantity: dt.quantity,
      duration: dt.duration,
      morningDosage: dt.morningDosage,
      noonDosage: dt.noonDosage,
      afternoonDosage: dt.afternoonDosage,
      eveningDosage: dt.eveningDosage,
      usageMethodId: dt.usageMethodId,
      price: dt.price,
    }));
    await PrescriptionDetail.insertMany(newDetails, { session });

    const totalPrice = newDetails.reduce((sum, item) => {
      const itemTotal = (item.price || 0) * item.quantity;
      return sum + itemTotal;
    }, 0)


    // update totalPrice;
    await Prescription.updateOne(
      { _id: new ObjectId(prescriptionId) },
      { $set: { totalPrice } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return { success: true };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error update prescription", error);
    throw error
  }
}

// Delete prescription
export const deletePrescription = async (prescriptionId: string) => {
  const session = await Prescription.startSession();
  session.startTransaction();
  try {
    if (!prescriptionId) throw new Error("PrescriptionId is required");
    await dbConnect();

    // First, soft delete prescription
    await Prescription.updateOne(
      { _id: new ObjectId(prescriptionId) },
      { $set: { deleted: true, deletedAt: new Date() } },
      { session }
    )


    // Secondly, soft delete all prescription details
    await PrescriptionDetail.updateMany(
      { prescriptionId: new ObjectId(prescriptionId) },
      { $set: { deleted: true } },
      { session }
    )

    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Delete is successfully" };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error delete prescription action", error);
    throw error;
  }
}