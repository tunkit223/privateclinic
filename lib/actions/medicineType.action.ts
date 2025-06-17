'use server'
import { Types } from "mongoose";
import dbConnect from "../mongoose"
import MedicineType from "@/database/medicineType"
import Medicine from "@/database/medicine";
import { trackSynchronousPlatformIOAccessInDev } from "next/dist/server/app-render/dynamic-rendering";

export const getMedicineTypeList = async () => {
    try {
      await dbConnect();
      const medicineTypes = await MedicineType.find({ deleted: false })
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
    const objectId = typeof id === "string" ? new Types.ObjectId(id) : id;
  
    try {
      const medicineType = await MedicineType.findOne({
        _id: objectId,
        deleted: false, // ✨ chỉ lấy bản chưa xoá
      }).select('name');
  
      if (!medicineType) {
        return "Unknown";
      }
      return medicineType.name;
    } catch (error) {
      console.error(error);
      return "Error occurred"; 
    }
  };

  export const deleteMedicineType = async (id: Types.ObjectId | string) => {
   try{
    await dbConnect();
    const deleted = await MedicineType.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: new Date() }, // ✨ soft‑delete
      { new: true }
    );

    if(!deleted){
      throw new Error("Medicine type not found");
    }
    return  { success: true, message: "Deleted successfully" };
   } catch(error){
    console.error("Error deleting medicine type:", error);
    return { success: false, message: "Error deleting medicine type" };
   }
  };

  export const updateMedicineType = async (id: Types.ObjectId | string, data: any) => {
    try{
      await dbConnect();

      const updatedMedicineType = await MedicineType.findOneAndUpdate(
        { _id: id, deleted: false },          // ✨ chỉ update bản chưa xoá
        { name: data.name, description: data.description },
        { new: true }
      );
      if (!updatedMedicineType) {
        throw new Error("Medicine type not found")
      }
  
      return {
        success: true,
        message: "Medicine type updated successfully",
        updatedMedicineType,
      }
    } catch (error) {
      console.error("Error updating medicine type:", error)
      return { success: false, message: "Error updating medicine type" }
    }
    
  };

  // Kiểm tra xem loại thuốc có đang được sử dụng trong bất kỳ thuốc nào chưa
export const checkMedicineTypeInUse = async (
  medicineTypeId: string | Types.ObjectId
): Promise<{
  inUse: boolean;
  sampleMedicineName?: string;
  sampleMedicineId?: string;
}> => {
  const id = Types.ObjectId.isValid(medicineTypeId)
    ? new Types.ObjectId(medicineTypeId)
    : medicineTypeId;

  const medicine = await Medicine.findOne({
    medicineTypeId: id,
    deleted: false,
  }).select("_id name");

  return {
    inUse: !!medicine,
    sampleMedicineId: medicine?._id?.toString(),
    sampleMedicineName: medicine?.name,
  };
};
