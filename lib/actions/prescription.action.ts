'use server'


import Prescription from "@/database/prescription.model";
import dbConnect from "../mongoose"
import PrescriptionDetail from "@/database/prescriptionDetail.model";
import MedicalReport from "@/database/medicalReport.modal";

import { Create_EditPrescriptionPayload } from '@/lib/interfaces/create_editPrescriptionPayload.interface';
import { ObjectId } from "mongodb";
import Invoice from "@/database/invoice.model";
import { removePrescriptionFromInvoice, updateInvoiceWithPrescription } from "./invoice.action";
import UsageMethod from "@/database/usageMethod.model";
import Medicine from "@/database/medicine";
import { getMedicineNameById, getMedicineUnitById } from "./medicine.action";
import { getUsageMethodNameById } from "./usageMethod.action";
import { Types } from "mongoose";



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
    await dbConnect();
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
            select: "name phone birthdate address gender",
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

export const getPrescriptionDetailsById = async (prescriptionId: string, session: any = null) => {
  try {
    // await dbConnect();
    const details = await PrescriptionDetail.find({
      prescriptionId,
      deleted: { $ne: true }
    },
      null,
      session ? { session } : {}
    )
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
    return null
  }
}
export const createPrescription = async ({
  medicalReportId,
  prescribeByDoctor = "Unknown Doctor",
  details,
}: Create_EditPrescriptionPayload) => {

  const session = await Prescription.startSession();
  session.startTransaction();

  try {
    console.log("Bắt đầu tạo prescription với medicalReportId:", medicalReportId);

    await dbConnect();
    console.log("Đã kết nối cơ sở dữ liệu");

    const newPrescription = new Prescription({
      medicalReportId,
      prescribeByDoctor,
    });
    console.log("Prescription trước khi lưu:", newPrescription.toObject());

    await newPrescription.save({ session });
    console.log("Prescription sau khi lưu lần đầu:", newPrescription.toObject());


    const detailPrescription = details.map((detail) => ({
      ...detail,
      prescriptionId: newPrescription._id,
    }));
    await PrescriptionDetail.insertMany(detailPrescription, { session });


    // console.log(details);
    const totalPrice = details.reduce((sum, item) => {
      const itemTotal = (item.price || 0) * item.quantity;
      return sum + itemTotal;
    }, 0)



    const updatedPrescription = await Prescription.findOneAndUpdate(
      { _id: newPrescription._id },
      { $set: { totalPrice } },
      { session, new: true }
    ).populate('prescribeByDoctor');

    console.log("Prescription sau khi lưu lần thứ hai:", newPrescription.toObject());

    // Update invoice with prescription
    await updateInvoiceWithPrescription({
      medicalReportId,
      prescription: updatedPrescription,
      session
    })
    await session.commitTransaction();
    session.endSession();

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
    await session.abortTransaction();
    session.endSession();
    console.log("Create prescription:", error)
    throw error;
  }
}

export const getPatientExaminedList = async (includeMedicalReportId?: string) => {
  try {
    const usedMedicalReportIds = await Prescription.find({ deleted: false }).distinct("medicalReportId");

    const filteredIds = includeMedicalReportId
      ? usedMedicalReportIds.filter(id => id.toString() !== includeMedicalReportId) : usedMedicalReportIds;

    const medicalReportExamined = await MedicalReport.find({
      status: "examined",
      _id: { $nin: filteredIds }
    })
      .populate({
        path: "appointmentId",
        select: "date",
        populate: {
          path: "patientId",
          select: "name",
        }
      })
    if (includeMedicalReportId) {
      const includeReport = await MedicalReport.findById(includeMedicalReportId).populate({
        path: "appointmentId",
        select: "date",
        populate: {
          path: "patientId",
          select: "name",
        }
      })
      if (includeReport) {
        medicalReportExamined.push(includeReport);
      }
    }
    const formatted = medicalReportExamined.map((item: any) => ({
      medicalReportId: item._id,
      patientId: item.appointmentId.patientId._id,
      name: item.appointmentId.patientId.name,
      dateAppointment: item.appointmentId.date
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

    // Validate prescribeByDoctor
    let doctorId = payload.prescribeByDoctor;
    if (typeof payload.prescribeByDoctor === 'object' && payload.prescribeByDoctor !== null) {
      // Handle case where prescribeByDoctor is { value, label }
      doctorId = (payload.prescribeByDoctor as { value: string; label: string }).value;
    }
    // Update general information of prescription
    await Prescription.updateOne(
      { _id: new ObjectId(prescriptionId) },
      {
        $set: {
          medicalReportId: new ObjectId(payload.medicalReportId),
          prescribeByDoctor: new ObjectId(doctorId),
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

    // Calculate totalPrice
    const totalPrice = newDetails.reduce((sum, item) => {
      const itemTotal = (item.price || 0) * item.quantity;
      return sum + itemTotal;
    }, 0)
    console.log("total price", totalPrice)


    // update totalPrice;
    const updatedPrescription = await Prescription.findOneAndUpdate(
      { _id: new ObjectId(prescriptionId) },
      { $set: { totalPrice } },
      { session, new: true }
    ).populate('prescribeByDoctor');

    if (!updatedPrescription) {
      throw new Error("Prescription not found after update - (in prescription.action func update for invoice)")
    }

    // console.log("Start updated invoice in update Prescription")
    // console.log("medicalreport id", updatedPrescription.medicalReportId.toString())
    // console.log("prescription", updatedPrescription)

    await updateInvoiceWithPrescription({
      medicalReportId: updatedPrescription.medicalReportId.toString(),
      prescription: updatedPrescription,
      session
    })

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

    // Find the prescription to get medicalReportId
    const prescription = await Prescription.findById(prescriptionId).session(session);
    if (!prescription) {
      throw new Error("Prescription not found to get medicalReportId")
    }

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

    // Remove prescription from invoice
    await removePrescriptionFromInvoice({
      medicalReportId: prescription.medicalReportId.toString(),
      session
    })


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

export const getPrescriptionByMedicalReportId = async (medicalReportId: string) => {
  try {
    await dbConnect();

    const prescription = await Prescription.findOne({
      medicalReportId: medicalReportId
    });

    if (!prescription) {
      console.log("No prescription found for this medicalReportId");
      return false;
    }
    return prescription._id.toString();
  } catch (error) {
    console.error("Error get prescription by medicalReportId", error);
    return false;
  }
};

export const getPrescriptionDetailsByPrescriptionId = async (prescriptionId: string) => {
  try {
    await dbConnect();

    const details = await PrescriptionDetail.find({
      prescriptionId: prescriptionId,
      deleted: false,
    });

    const result = await Promise.all(
      details.map(async (detail) => {
        const medicinename = await getMedicineNameById(detail.medicineId.toString());
        const medicineunit = await getMedicineUnitById(detail.medicineId.toString());
        const usageMethodname = await getUsageMethodNameById(detail.usageMethodId.toString());

        return {
          Name: medicinename || "",
          Unit: medicineunit || "",
          Amount: detail.quantity.toString(),
          Usage: usageMethodname || "",
        };
      })
    );

    return result;
  } catch (error) {
    console.error("Error in getPrescriptionDetailsByPrescriptionId", error);
    return false;
  }
};


// func delete one prescription detail when removing medicine
export const deleteOnePrescriptionDetail = async (medicineId: string | Types.ObjectId) => {
  try {
    await dbConnect();
    const medicineObjectId = Types.ObjectId.isValid(medicineId) ? new Types.ObjectId(medicineId) : medicineId;

    // Find all prescription is outstanding
    const unPaidPrescriptions = await Prescription.find({ isPaid: false }).select("_id medicalReportId");
    console.log("Unpaid prescriptions found:",
      unPaidPrescriptions.length, unPaidPrescriptions.map((p: any) => p._id.toString()));
    if (!unPaidPrescriptions) {
      return {
        success: true,
        message: "No unpaid prescription found",
        updatedDetails: []
      }
    }

    // Get list prescriptionId
    const prescriptionIds = unPaidPrescriptions.map((prescription: any) => prescription._id);
    const prescriptionMap = new Map(
      unPaidPrescriptions.map((p) => [p._id.toString(), p.medicalReportId])
    );
    console.log("Prescription IDs:", prescriptionIds.map((id: any) => id.toString()));


    const updatedDetails = await PrescriptionDetail.updateMany(
      {
        medicineId: medicineObjectId,
        prescriptionId: { $in: prescriptionIds },
        deleted: false
      },
      {
        $set: {
          deleted: true,
          deletedAt: new Date(),
        }
      },
    )
    console.log("Update result:", updatedDetails);

    for (const prescription of unPaidPrescriptions) {
      const prescriptionId = prescription._id;
      const medicalReportId = prescription.medicalReportId;

      const remainingDetails = await PrescriptionDetail.find({
        prescriptionId: prescriptionId,
        deleted: false,
      }).select("price quantity")
      console.log(remainingDetails);

      const newTotalPrice = remainingDetails.reduce((total, detail) => {
        const price = detail.price || 0;
        const quantity = detail.quantity || 1;
        return total + price * quantity;
      }, 0)


      const updateResult = await Prescription.updateOne(
        { _id: prescriptionId },
        { $set: { totalPrice: newTotalPrice } }
      )

      console.log(`Updated totalPrice for prescription ${prescriptionId}:`, updateResult.modifiedCount);


      const fullPrescription = await Prescription.findById(prescriptionId)

      await updateInvoiceWithPrescription({
        medicalReportId: medicalReportId.toString(),
        prescription: fullPrescription,
        session: null
      })
    }


    return {
      success: true,
      message: `Updated ${updatedDetails.modifiedCount} prescription detail(s) for medicine ${medicineId}`,
      updatedDetails: updatedDetails.modifiedCount,
    };
  } catch (error: any) {
    console.error("Error deleting prescription details for medicine:", error.message);

    return {
      success: false,
      message: "Error deleting prescription details",
      error: error.message,
    };
  }
}
