'use server'
import { Types } from "mongoose";
import dbConnect from "../mongoose"
import MedicineType from "@/database/medicineType"
import { trackSynchronousPlatformIOAccessInDev } from "next/dist/server/app-render/dynamic-rendering";

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
    const objectId = typeof id === "string" ? new Types.ObjectId(id) : id;
  
    try {
      const medicineType = await MedicineType.findById(objectId).select("name");
  
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
    const deleted = await MedicineType.findByIdAndDelete(id);

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

      const updatedMedicineType = await MedicineType.findByIdAndUpdate(
        id , 
        {name : data.name, description: data.description},
        {new: true}
      )
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