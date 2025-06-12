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
  deleted?: boolean,
  deletedAt?: Date, 
}) => {
  try {
    await dbConnect()

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

      deleted: false,
      deletedAt: null,
    })
    console.log('New batch:', newBatch)

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

// Lấy danh sách các lô thuốc, populate thông tin thuốc
export const getMedicineBatches = async (): Promise<(IMedicineBatch & {
  medicineName: string,
  unit: string,
  _id: string
})[]> => {
  await dbConnect()
  const batches = await MedicineBatch.find({deleted: false})
    .populate("medicineId", "name unit")
    .sort({ importDate: -1 })
    .lean<IMedicineBatch[]>()

  return batches.map(batch => ({
    ...batch,
    medicineName: batch.medicineId ? (batch.medicineId as any).name : "Unknown",
    unit: batch.medicineId ? (batch.medicineId as any).unit : "",
    _id: batch._id.toString(),
  }))
}

// Cập nhật trạng thái lô thuốc (vd: từ "dang-nhap" sang "da-nhap")
export const updateMedicineBatchStatus = async (
  id: string | Types.ObjectId,
  status: string
) => {
  try {
    await dbConnect()
    const batch = await MedicineBatch.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!batch) throw new Error("Medicine batch not found")

    return {
      success: true,
      message: "Status updated successfully",
      batch,
    }
  } catch (error) {
    console.error("Error updating medicine batch status:", error)
    return {
      success: false,
      message: "Error updating status",
    }
  }
}

// Tăng số lượng thuốc trong kho khi lô thuốc được xác nhận "da-nhap"
export const increaseMedicineAmountFromBatch = async (
  medicineId: string | Types.ObjectId,
  amount: number
) => {
  try {
    await dbConnect()
    const medicine = await Medicine.findById(medicineId)
    if (!medicine) throw new Error("Medicine not found")

    medicine.amount += amount
    await medicine.save()

    return {
      success: true,
      message: "Medicine amount increased",
      medicine,
    }
  } catch (error) {
    console.error("Error increasing medicine amount:", error)
    return {
      success: false,
      message: "Error updating medicine amount",
    }
  }
}

export const importMedicineBatchesFromExcel = async (
  rows: ExcelRow[]
) => { 
  try {
    // Xử lý từng dòng
    for (const row of rows) {
      if (!row.medicineName || !row.importQuantity) continue

      // Tìm thuốc theo tên (cần import model Medicine)
      const medicine = await Medicine.findOne({ name: row.medicineName })
      if (!medicine) continue

  
    
      await MedicineBatch.create({
        medicineId: medicine._id,
        importQuantity: row.importQuantity,
        importDate: row.importDate ? new Date(row.importDate) : new Date(),
        expiryDate: row.expiryDate ? new Date(row.expiryDate) : null,
        note: row.note || '',
        status: 'importing',
        
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