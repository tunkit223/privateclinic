'use server'
import Medicine from "@/database/medicine";
import dbConnect from "../mongoose";

export const addMedicine = async (data : any) =>{
  try {
    await dbConnect();
    const newMedicine = await Medicine.create({
      name: data.name,
      unit: data.unit,
      amount: data.amount,
      price: data.price
    })
    return{
      ...newMedicine.toObject(), 
      _id: newMedicine._id.toString(),
    }
  } catch (error) {
    console.log(error)
  }
}


export const getMedicineList = async () => {
  try {
    const medicines = await Medicine.find()
      .sort({ createdAt: -1 })
      .lean();
    
    const data = {
      documents: medicines,
    };
    
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching medicine:", error);
    return null;
  }
};