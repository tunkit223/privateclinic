'use server'
import { ID, Query } from "node-appwrite"
import { parseStringify } from "../utils"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { InputFile } from "node-appwrite/file";
import dbConnect from "../mongoose";
import Patient from "@/database/patient.model";
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

    // Kiểm tra trùng lặp
    const existingPatient = await Patient.findOne({
      $or: [
        { email: data.email },
        { phone: data.phone }
      ]
    });

    if (existingPatient) {
      throw new Error('Email hoặc số điện thoại đã tồn tại');
    }

    // Tạo patient mới
    const newPatient = await Patient.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      address: data.address,
      birthdate: data.birthDate,
      // Thêm các trường khác nếu cần
    });

    return {
      ...newPatient.toObject(), // Chuyển mongoose document sang plain object
      _id: newPatient._id.toString() // Đảm bảo _id là string
    }
  } catch (error) {
    throw error;
  }
};

export const getPatientList = async () => {
  try {
    const patient = await Patient.find()
      .sort({ createdAt: -1 })
      .lean();

    const data = {
      documents: patient,
    };

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching patient:", error);
    return null;
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
