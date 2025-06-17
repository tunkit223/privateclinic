'use server'

import MedicineBatch, { IMedicineBatch } from "@/database/medicineBatch"
import Medicine from "@/database/medicine"
import dbConnect from "../mongoose"
import { Types } from "mongoose"
import * as XLSX from "xlsx"
import { ExcelRow } from '@/components/Types/excel'
import Success from "@/app/patient/[patientId]/appointment/success/page"
import { message } from "antd"

import { formatDate, getDateRange, toPlainObject } from "@/lib/utils"

// Thêm 1 lô thuốc mới
export const addMedicineBatch = async (data: {
  medicineId: string | Types.ObjectId,
  importQuantity: number,
  importDate: string | Date,
  expiryDate?: string | Date | null,
  note?: string,
  status?: string,
  totalValue?: number,
  deleted?: boolean,
  deletedAt?: Date,
}) => {
  try {
    await dbConnect()

    const medicine = await Medicine.findById(data.medicineId);
    if (!medicine) throw new Error("Medicine does not exist.");

    const price = medicine.price;
    const totalValue = price * data.importQuantity;

    // Kiểm tra và chuyển đổi kiểu dữ liệu ngày
    const importDate = new Date(data.importDate)
    const expiryDate = data.expiryDate ? new Date(data.expiryDate) : null

    if (isNaN(importDate.getTime())) throw new Error('Invalid import date.')
    if (expiryDate && isNaN(expiryDate.getTime())) throw new Error('Invalid expiry date.')

    const newBatch = await MedicineBatch.create({
      medicineId: new Types.ObjectId(data.medicineId),
      importQuantity: data.importQuantity,
      importDate,
      expiryDate,
      note: data.note || '',
      status: data.status || 'importing',
      totalValue,
      deleted: false,
      deletedAt: null,
    })


    return {
      success: true,
      data: toPlainObject({
        ...newBatch.toObject(),
        _id: newBatch._id.toString(),
      }),
    }
  } catch (error: any) {

    return {
      success: false,
      message: error.message || 'An unknown error occurred.'
    }
  }
}
export type MedicineBatchWithExtras = IMedicineBatch & {
  _id: string;
  medicineName: string;
  unit: string;
  medicineTypeName: string;
};
// Lấy danh sách các lô thuốc, populate thông tin thuốc
export const getMedicineBatches = async (): Promise<MedicineBatchWithExtras[]> => {
  await dbConnect();

  const batches = await MedicineBatch.find({ deleted: false })
    .populate({
      path: "medicineId",
      select: "name unit medicineTypeId",
      populate: {
        path: "medicineTypeId",
        select: "name",
      },
    })
    .sort({ importDate: -1 })
    .lean<IMedicineBatch[]>();

  return batches.map(batch => {
    const medicine: any = batch.medicineId;

    return {

      ...batch,
      _id: batch._id.toString(),
      medicineName: medicine?.name || "Unknown",
      unit: medicine?.unit || "",
      medicineTypeName: medicine?.medicineTypeId?.name || "Unknown",

    };
  });
};
// Cập nhật trạng thái lô thuốc (vd: từ "dang-nhap" sang "da-nhap")
// lib/actions/medicineBatch.action.ts

export const updateMedicineBatchStatus = async (
  id: string | Types.ObjectId,
  status: string
) => {
  try {
    await dbConnect();

    // 1. Lấy batch để biết medicineId
    const batchDoc = await MedicineBatch.findById(id);
    if (!batchDoc) throw new Error("Medicine batch not found");

    // 2. Kiểm tra thuốc
    const medicine = await Medicine.findById(batchDoc.medicineId);
    if (!medicine) throw new Error("Medicine not found");

    if (medicine.deleted) {
      // Thuốc đã bị xoá ⇒ không cho import
      return {
        success: false,
        deleted: true,                 // ⚠️ flag để client biết lý do
        message: "Medicine has been deleted",
      };
    }

    // 3. Thuốc hợp lệ ⇒ cập nhật status
    const updatedBatch = await MedicineBatch.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return {
      success: true,
      message: "Status updated successfully",
      batch: toPlainObject({
        ...updatedBatch!.toObject(),
        _id: updatedBatch!._id.toString(),
      }),
    };
  } catch (error) {

    return {
      success: false,
      message: "Error updating status",
    };
  }
};

// Tăng số lượng thuốc trong kho khi lô thuốc được xác nhận "da-nhap"

export const increaseMedicineAmountFromBatchItems = async (
  batchId: string | Types.ObjectId
) => {
  try {
    await dbConnect();

    const batch = await MedicineBatch.findById(batchId);
    if (!batch) throw new Error("Medicine batch not found.");

    const medicine = await Medicine.findById(batch.medicineId);
    if (!medicine) throw new Error("Medicine not found.");

    medicine.amount += batch.importQuantity;
    await medicine.save();

    return {
      success: true,
      message: "Stock quantity increased successfully.",
    };
  } catch (error) {

    return {
      success: false,
      message: "Stock quantity increased successfully.",
    };
  }
};
export const importMedicineBatchesFromExcel = async (
  rows: ExcelRow[]
) => {
  try {
    // Xử lý từng dòng
    for (const row of rows) {
      if (!row.medicineName) {
        throw new Error("❌ Missing medicine name in one of the rows.");
      }
      
      if (!row.importQuantity) {
        throw new Error(`❌ Missing import quantity for medicine “${row.medicineName}”.`);
      }
      
      // Find medicine by name
      const foundMedicine = await Medicine.findOne({ name: row.medicineName });
      if (!foundMedicine) {
        throw new Error(`❌ Medicine “${row.medicineName}” not found in the system.`);
      }
      
      if (foundMedicine.deleted /* or foundMedicine.isDeleted */) {
        throw new Error(
          `❌ Cannot import: Medicine “${row.medicineName}” has been deleted from the system.`
        );
      }

      const price = foundMedicine.price || 0;
      const totalValue = price * row.importQuantity * 0.8;


      await MedicineBatch.create({
        medicineId: foundMedicine._id,
        importQuantity: row.importQuantity,
        importDate: row.importDate ? new Date(row.importDate) : new Date(),
        expiryDate: row.expiryDate ? new Date(row.expiryDate) : null,
        note: row.note || '',
        status: 'importing',
        totalValue,
      })
    }

    return {
      success: true, message: 'Import successful!'
    }
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      message: `❌ Failed to import: ${err.message || "Unknown error occurred."}`,
    };
  }
}

export const deleteMedicineBatch = async (id: string | Types.ObjectId) => {
  try {
    await dbConnect();

    const deletedBatch = await MedicineBatch.findByIdAndUpdate(
      id,
      {
        deleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!deletedBatch) {
      throw new Error("Medicine batch not found");
    }

    return {
      success: true,
      message: "Medicine batch soft deleted successfully",

    };
  } catch (error) {

    return {
      success: false,
      message: "Error deleting medicine batch",
    };
  }
}


export async function getExpenseFromDatetoDate(fromDate: Date, toDate: Date) {
  await dbConnect();

  const batches = await MedicineBatch.find({
    status: "imported",
    importDate: {
      $gte: fromDate,
      $lte: toDate,
    },
  }).lean();

  // Gom chi phí theo ngày
  const expenseMap = new Map<string, number>();
  for (const batch of batches) {
    const date = formatDate(new Date(batch.importDate));
    const value = batch.totalValue || 0;
    expenseMap.set(date, (expenseMap.get(date) || 0) + value);
  }

  // Đảm bảo có đủ ngày trong khoảng, kể cả khi value = 0
  const allDates = getDateRange(fromDate, toDate);
  const result = allDates.map((date) => ({
    date,
    value: expenseMap.get(date) || 0,
    type: "expense" as const,
  }));

  return result;
}