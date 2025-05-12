'use server'
import { Types } from "mongoose";
import dbConnect from "../mongoose"
import MedicineType from "@/database/medicineType"

export const getMedicineTypeList = async () => {
    try {
      await dbConnect();
      const medicineTypes = await MedicineType.find()
        .sort({ createdAt: -1 })
        .lean();
      
      const data = {
        documents: medicineTypes,
      };
      
      return JSON.parse(JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching medicine:", error);
      return null;
    }
  };
  export const addMedicineType = async (data :any) => {
    try {
      await dbConnect();
      const newType = await MedicineType.create({
        name: data.name,
        description: data.description,
    })
    console.log(newType)
      return {
        _id: newType._id.toString()
      };
    } catch (error) {
      console.error("Error adding medicine type:", error);
      throw error;
    }
  };
  export const getMedicineTypeNameById = async (id: Types.ObjectId | string) => {
    // Kiểm tra nếu id là string, chuyển sang ObjectId
    const objectId = typeof id === "string" ? new Types.ObjectId(id) : id;
  
    try {
      // Tìm kiếm loại thuốc trong bảng MedicineType
      const medicineType = await MedicineType.findById(objectId).select("name");
  
      if (!medicineType) {
        return "Unknown"; // Nếu không tìm thấy, trả về "Unknown"
      }
  
      // Trả về name của loại thuốc
      return medicineType.name;
    } catch (error) {
      console.error(error);
      return "Error occurred"; // Xử lý lỗi
    }
  };