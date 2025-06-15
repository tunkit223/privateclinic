'use server'
import { ID, Query } from "node-appwrite"
import { parseStringify } from "../utils"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { InputFile } from "node-appwrite/file";
import dbConnect from "../mongoose";
import Patient from "@/database/patient.model";

import { Types } from "mongoose";
import { IPatient } from "@/database/patient.model";
import Success from "@/app/patient/[patientId]/appointment/success/page";

import PatientReport from "@/database/patientReport.model";


// Trang viet cac funtion cho backend



export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
};

export const registerPatient = async (data: any) => {
  try {
    await dbConnect();

    // Tìm bệnh nhân theo email
    const existingByEmail = await Patient.findOne({ email: data.email });

    if (existingByEmail) {
      // Nếu đã có email này rồi, trả về luôn bệnh nhân đó
      return {
        ...existingByEmail.toObject(),
        _id: existingByEmail._id.toString()
      };
    }

    // Nếu chưa có email, kiểm tra trùng số điện thoại
    const existingByPhone = await Patient.findOne({ phone: data.phone });

    if (existingByPhone) {
      throw new Error('Số điện thoại đã được sử dụng bởi bệnh nhân khác');
    }

    // Tạo patient mới
    const newPatient = await Patient.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      address: data.address,
      birthdate: data.birthdate,
      // Thêm các trường khác nếu cần
    });

    return {
      ...newPatient.toObject(), 
      _id: newPatient._id.toString() 
    }
  } catch (error) {
    throw error;
  }
};

async function addDeletedFieldToExistingPatients() {
  await dbConnect();

  const result = await Patient.updateMany(
    { deleted: { $exists: false } },  // chỉ cập nhật những bản ghi chưa có trường deleted
    { $set: { deleted: false, deletedAt: null } }
  );

  console.log("Updated documents count:", result.modifiedCount);
}

addDeletedFieldToExistingPatients().catch(console.error);
export const getPatientList = async (): Promise<{ documents: (IPatient & { _id: string })[] } | null> => {
  try {
    const patients = await Patient.find({deleted : {$ne: true}}) // Lọc các bệnh nhân chưa bị xóa
      .sort({ createdAt: -1 })
      .lean<Array<{ _id: Types.ObjectId } & IPatient>>(); // khai báo mảng rõ ràng

    return {
      documents: patients.map((p) => ({
        ...p,
        _id: p._id.toString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching patient:", error);
    return null;
  }
};

export const deletePatient = async (id: Types.ObjectId | string) => {
  try {
    await dbConnect();

    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!updatedPatient) {
      throw new Error("Patient not found");
    }

    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    console.error("Error deleting patient:", error);
    return { success: false, message: "Error deleting patient" };
  }
};
export const updatePatient = async (id: Types.ObjectId | string, data: any) => {
  try {
    await dbConnect();

    if (data.deleted === true) {
      data.deletedAt = new Date();
    } else if (data.deleted === false) {
      data.deletedAt = null;
    }

    const updatedPatient = await Patient.findByIdAndUpdate(id, data, { new: true });

    if (!updatedPatient) {
      throw new Error("Patient not found");
    }

    return {
      success: true,
      message: "Patient updated successfully",
      updatedPatient:JSON.parse(JSON.stringify(data))
    };
  } catch (error) {
    console.error("Error updating Patient:", error);
    return { success: false, message: "Error updating Patient" };
  }
};

export const restorePatient = async (id: Types.ObjectId | string) => {
  try {
    await dbConnect();
    const restoredPatient = await Patient.findByIdAndUpdate(
      id,
      { deleted: false, deletedAt: null },
      { new: true }
    );
    if (!restoredPatient) throw new Error("Patient not found");
    return { success: true, message: "Restored successfully" };
  } catch (error) {
    console.error("Error restoring patient:", error);
    return { success: false, message: "Error restoring patient" };
  }
};


export const getPatientRecord = async () => {
  try {
    const patient = await PatientReport.find()
      .sort({ createdAt: -1 })
      .lean();

    const data = {
      documents: patient,
    };

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching patient record:", error);
    return null;
  }
}


export const checkPatientByEmail = async (email: string) => {
  try {
    await dbConnect()

    const patient = await Patient.findOne({ email, deleted: false }).lean()

    if (!patient) return null

    return JSON.parse(JSON.stringify(patient));
    
  } catch (error) {
    console.error('Lỗi kiểm tra bệnh nhân theo email:', error)
    throw error
  }
}

export const getPatientById = async (id: string) => {
  try {
    await dbConnect();
    const patient = await Patient.findById(id).lean();
    return JSON.parse(JSON.stringify(patient));
  } catch (error) {
    console.error("Lỗi khi lấy thông tin bệnh nhân:", error);
    return null;
  }
}

