'use server'
import Medicine from "@/database/medicine";
import MedicineType from "@/database/medicineType";
import dbConnect from "../mongoose";

export const addMedicine = async (data: any) => {
  try {
    await dbConnect();
    const newMedicine = await Medicine.create({
      medicineTypeId: data.medicineTypeId,
      name: data.name,
      unit: data.unit,
      amount: data.amount,
      price: data.price
    })
    return {
      ...newMedicine.toObject(),
      _id: newMedicine._id.toString(),
    }
  } catch (error) {
    console.log(error)
  }
}

export const getMedicinesWithType = async () => {
  await dbConnect();
  const medicines = await Medicine.find()
    .populate("medicineTypeId", "name")
    .select("name")
    .lean();

  return medicines.map(med => ({
    ...med,
    medicineTypeName: med.medicineTypeId ? med.medicineTypeId.name : 'Unknown'
  }));
};
export const getMedicineList = async () => {
  try {
    await dbConnect();
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

export const getMedicineByName = async (name: string): Promise<string> => {
  await dbConnect();
  const medicine = await Medicine.findOne({ name });
  if (!medicine) throw new Error(`Medicine "${name}" not found`);
  return medicine._id.toString();
};

export const getMedicineById = async (medicineId: string) => {
  await dbConnect();
  const medicine = await Medicine.findById({ medicineId });
  if (!medicine) throw new Error(`Medicine "${medicine}" not found`);
  return medicine._id.toString();
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
