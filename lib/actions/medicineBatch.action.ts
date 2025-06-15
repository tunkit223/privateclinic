'use server'

import MedicineBatch, { IMedicineBatch } from "@/database/medicineBatch"
import Medicine from "@/database/medicine"
import dbConnect from "../mongoose"
import { Types } from "mongoose"
import * as XLSX from "xlsx"
import { ExcelRow } from '@/components/Types/excel'
import Success from "@/app/patient/[patientId]/appointment/success/page"
import { message } from "antd"


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
    if (!medicine) throw new Error("Thuốc không tồn tại");

    const price = medicine.price;
    const totalValue = price * data.importQuantity;

    // Kiểm tra và chuyển đổi kiểu dữ liệu ngày
    const importDate = new Date(data.importDate)
    const expiryDate = data.expiryDate ? new Date(data.expiryDate) : null

    if (isNaN(importDate.getTime())) throw new Error('Ngày nhập không hợp lệ')
    if (expiryDate && isNaN(expiryDate.getTime())) throw new Error('Hạn sử dụng không hợp lệ')

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
      data: {
        ...newBatch.toObject(),
        _id: newBatch._id.toString(),
      }
    }
  } catch (error: any) {
    console.error('Lỗi khi thêm lô thuốc:', error)
    return {
      success: false,
      message: error.message || 'Đã xảy ra lỗi không xác định'
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
      medicineName: medicine?.name || "Không xác định",
      unit: medicine?.unit || "",
      medicineTypeName: medicine?.medicineTypeId?.name || "Không xác định",
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
      batch: updatedBatch,
    };
  } catch (error) {
    console.error("Error updating medicine batch status:", error);
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
    if (!batch) throw new Error("Không tìm thấy đơn nhập thuốc");

    const medicine = await Medicine.findById(batch.medicineId);
    if (!medicine) throw new Error("Không tìm thấy thuốc");

    medicine.amount += batch.importQuantity;
    await medicine.save();

    return {
      success: true,
      message: "Tăng số lượng thành công",
    };
  } catch (error) {
    console.error("❌ Tăng số lượng thuốc thất bại:", error);
    return {
      success: false,
      message: "Tăng số lượng thất bại",
    };
  }
};
export const importMedicineBatchesFromExcel = async (
  rows: ExcelRow[]
) => { 
  try {
    // Xử lý từng dòng
    for (const row of rows) {
      if (!row.medicineName || !row.importQuantity) continue

      // Tìm thuốc theo tên (cần import model Medicine)
      const foundMedicine = await Medicine.findOne({ name: row.medicineName });
      if (!foundMedicine) continue;

      const price = foundMedicine.price || 0;
      const totalValue = price * row.importQuantity;
  
    
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
      success: true, message: 'Đã import thành công'
    }
  } catch (error) {
    console.error('Error importing Excel:', error)
    console.error('Error importing Excel:', JSON.stringify(error, null, 2));
    return { success: false, message: 'Đã xảy ra lỗi khi import' }
  }
}

export const deleteMedicineBatch = async (id: string | Types.ObjectId) => {
  try{
    await dbConnect();

    const delletedBatch = await MedicineBatch.findByIdAndUpdate(
      id,
      {
        deleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if(!delletedBatch) {
      throw new Error("Medicine batch not found");
    }

    return {
      success: true,
      message: "Medicine batch soft deleted successfully",
      deleteMedicineBatch,
    };
  } catch (error) {
    console.error("Error deleting medicine batch:", error);
    return {
      success: false,
      message: "Error deleting medicine batch",
    };
  }
}