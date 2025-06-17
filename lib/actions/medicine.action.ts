'use server'
import Medicine from "@/database/medicine";
import MedicineType from "@/database/medicineType";
import dbConnect from "../mongoose";
import mongoose, { Types } from "mongoose";
import { IMedicine } from "@/database/medicine";
import Success from "@/app/patient/[patientId]/appointment/success/page";
import { startOfDay, endOfDay } from "date-fns"
import Invoice from "@/database/invoice.model"; import { deleteOnePrescriptionDetail } from "./prescription.action";
import PrescriptionDetail from "@/database/prescriptionDetail.model";
import Prescription from "@/database/prescription.model";

export const addMedicine = async (data: any) => {
  try {
    await dbConnect();
    const newMedicine = await Medicine.create({
      medicineTypeId: data.medicineTypeId,
      name: data.name,
      unit: data.unit,
      amount: 0,
      price: data.price
    })
    return {
      success: true,
      data: JSON.parse(JSON.stringify({
        ...newMedicine.toObject(),
        _id: newMedicine._id.toString(),
      })),
    };
  } catch (error) {
    console.log(error)
  }
}

export const getMedicinesWithType = async () => {
  await dbConnect();
  const medicines = await Medicine.find({ deleted: false })
    .populate("medicineTypeId", "name")
    .select("name unit amount price medicineTypeId")
    .lean();

  return medicines.map(med => ({
    ...med,
    medicineTypeName: med.medicineTypeId ? med.medicineTypeId.name : 'Unknown'
  }));
};

export const getMedicineTypes = async () => {
  await dbConnect();
  const medicineTypes = await MedicineType.find({deleted: false}).select('_id name').lean();
  return medicineTypes;
};

export const getMedicineList = async () => {
  try {
    await dbConnect();

    const medicines = await Medicine.find({ deleted: false })
      .sort({ createdAt: -1 })
      .lean();
    console.log(medicines);
    const data = {
      documents: medicines,
    };

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching medicine:", error);
    return null;
  }
};

export const getMedicineByName = async (name: string): Promise<string> => {
  await dbConnect();
  const medicine = await Medicine.findOne({ name });
  if (!medicine) throw new Error(`Medicine "${name}" not found`);
  return medicine._id.toString();
};

export const getMedicineById = async (medicineId: string) => {
  await dbConnect();
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) throw new Error(`Medicine "${medicine}" not found`);
  return medicine._id.toString();
};
export const getMedicineNameById = async (medicineId: string) => {
  await dbConnect();
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) throw new Error(`Medicine "${medicineId}" not found`);
  return medicine.name.toString();
};

export const getMedicineUnitById = async (medicineId: string) => {
  await dbConnect();
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) throw new Error(`Medicine "${medicineId}" not found`);
  return medicine.unit.toString();
};
export const getMedicinePriceByAmount = async (name: string, amount: number): Promise<string> => {
  await dbConnect();
  const medicine = await Medicine.findOne({ name });
  if (!medicine) throw new Error(`Medicine "${name}" not found`);
  return (amount * medicine.price).toString();
};

export const validateMedicine = async (name: string) => {
  try {
    await dbConnect();
    const medicine = await Medicine.findOne({ name });
    return medicine.unit;
  } catch (error) {
    console.error("Error validating medicine", error);
    return null;
  }
};

export const updateMedicine = async (id: Types.ObjectId | string, data: any) => {
  try {
    await dbConnect();

    if (data.deleted === true) {
      data.deletedAt = new Date();
    } else if (data.deleted === false) {
      data.deletedAt = null;
    }

    const updateMedicine = await Medicine.findByIdAndUpdate(id, data, { new: true });

    if (!updateMedicine) {
      throw new Error("Medicine not found");
    }

    return {
      success: true,
      message: "Medicine updated successfully",
      updateMedicine,
    };
  } catch (error) {
    console.error("Error updating medicine:", error);
    return {
      success: false,
      message: "Error updating medicine",
    };
  }
};

// Kiểm tra xem thuốc có đang được sử dụng trong đơn thuốc chưa
export const checkMedicineInUnpaidPrescriptions = async (
  medicineId: string | Types.ObjectId
): Promise<{ inUse: boolean; 
  prescriptionId?: string;
  prescriptionCode?: string;  
 }> => {
  const id = Types.ObjectId.isValid(medicineId)
    ? new Types.ObjectId(medicineId)
    : medicineId;

  const detail = await PrescriptionDetail.findOne({
    medicineId: id,
    deleted: false,
  }).populate({
    path: "prescriptionId",
    match: { isPaid: false, deleted: { $ne: true } },
    select: "_id code",
  });

  const unpaidPrescription = detail?.prescriptionId;

  return {
    inUse: !!unpaidPrescription,
    prescriptionId: unpaidPrescription?._id?.toString(),
    prescriptionCode: detail?.prescriptionId?.code,
  };
};



export const deleteMedicine = async (id: string | Types.ObjectId) => {
  try {
    await dbConnect();

    const deletedMedicine = await Medicine.findByIdAndUpdate(
      id,
      {
        deleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!deletedMedicine) {
      throw new Error("Medicine not found");
    }
    // Removing prescription details relevant
    const prescriptionDetailRelevant = await deleteOnePrescriptionDetail(id);
    console.log("Prescription detail update result:", prescriptionDetailRelevant);

    return {
      success: true,
      message: "Medicine soft deleted successfully",
      deletedMedicine,
      updatedPrescriptionDetails: prescriptionDetailRelevant
    };
  } catch (error: any) {
    console.error("Error deleting medicine:", error);
    return {
      success: false,
      message: "Error deleting medicine",
      error: error.message,

    };
  }
};

export const restoreMedicine = async (id: string | Types.ObjectId) => {
  try {
    await dbConnect();

    const restoredMedicine = await Medicine.findByIdAndUpdate(
      id,
      { deleted: false, deletedAt: null },
      { new: true }
    );

    if (!restoredMedicine) {
      throw new Error("Medicine not found");
    }

    return {
      success: true,
      message: "Medicine restored successfully",

    };
  } catch (error) {
    console.error("Error restoring medicine:", error);
    return {
      success: false,
      message: "Error restoring medicine",
    };
  }
};

export const getMedicineUsageReport = async (from: string, to: string) => {
  const fromDate = startOfDay(new Date(from))
  const toDate = endOfDay(new Date(to))

  const invoices = await Invoice.find({
    status: "paid",
    issueDate: { $gte: fromDate, $lte: toDate },
    "prescriptionId.details.0": { $exists: true }
  }).lean()

  const medicineMap: Record<string, {
    name: string,
    unit?: string,
    totalQuantity: number,
    usedCount: number
  }> = {}

  for (const invoice of invoices) {
    const details = invoice.prescriptionId?.details || []

    for (const item of details) {
      const key = item.medicineName + "|" + (item.unit || "")
      if (!medicineMap[key]) {
        medicineMap[key] = {
          name: item.medicineName,
          unit: item.unit || "",
          totalQuantity: 0,
          usedCount: 0
        }
      }
      medicineMap[key].totalQuantity += item.quantity
      medicineMap[key].usedCount += 1
    }
  }

  // Convert về mảng
  return Object.values(medicineMap)
}
export const checkMedicineStock = async (medicineId: string) => {
  try {
    await dbConnect();

    // Tìm thuốc trong cơ sở dữ liệu dựa trên medicineId và ép kiểu về IMedicine
    const medicine = await Medicine.findById(medicineId)
      .select('name amount unit')
      .lean() as IMedicine | null;

    if (!medicine) {
      throw new Error(`Medicine with ID "${medicineId}" not found`);
    }

    // Kiểm tra nếu thuốc đã bị xóa mềm (soft delete)
    if (medicine.deleted) {
      throw new Error(`Medicine "${medicine.name}" is marked as deleted`);
    }

    // Trả về thông tin tồn kho
    return {
      success: true,
      data: {
        medicineId: medicineId,
        name: medicine.name,
        unit: medicine.unit,
        availableQuantity: medicine.amount,
      },
    };
  } catch (error: any) {
    console.error("Error checking medicine stock:", error);
    return {
      success: false,
      message: error.message || "Error checking medicine stock",
    };
  }
};

export const decreaseMedicineAmount = async (
  medicineId: string | Types.ObjectId,
  quantity: number
) => {
  try {
    await dbConnect();

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) throw new Error("Medicine not found");

    if (medicine.amount < quantity) {
      throw new Error(`Insufficient stock for medicine "${medicine.name}": only ${medicine.amount} left, but ${quantity} required.`);
    }

    medicine.amount -= quantity;
    await medicine.save();

    return {
      success: true,
      message: "Số lượng thuốc đã được giảm",
    };
  } catch (error: any) {
    console.error("Lỗi khi giảm thuốc:", error);
    return {
      success: false,
      message: error.message || "Lỗi khi giảm số lượng thuốc",
    };
  }
};

export const decreaseMedicinesFromPrescription = async (
  prescriptionId: string
) => {
  await dbConnect();

  const details = await PrescriptionDetail.find({ prescriptionId }).lean();
  if (!details.length)
    throw new Error("Đơn thuốc không có chi tiết");

  for (const item of details) {
    const result = await decreaseMedicineAmount(item.medicineId, item.quantity);
    if (!result.success) {
      throw new Error(result.message); // NÉM lỗi từ bên trong ra
    }
  }
};

