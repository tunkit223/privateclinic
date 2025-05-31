'use server'
import Medicine from "@/database/medicine";
import MedicineType from "@/database/medicineType";
import dbConnect from "../mongoose";
import { Types } from "mongoose";
import { IMedicine } from "@/database/medicine";
import Success from "@/app/patient/[patientId]/appointment/success/page";


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
  const medicines = await Medicine.find({ deleted: false })
  .populate("medicineTypeId", "name")
  .select("name unit amount price medicineTypeId")
  .lean();

  return medicines.map(med => ({
    ...med,
    medicineTypeName: med.medicineTypeId ? med.medicineTypeId.name : 'Unknown'
  }));
};

export const getMedicineTypes = async () => {
  await dbConnect();
  const medicineTypes = await MedicineType.find({}).select('_id name').lean();
  return medicineTypes;
};

export const getMedicineList = async () => {
  try {
    await dbConnect();
    const medicines = await Medicine.find({ deleted: false })
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

export const updateMedicine = async (id: Types.ObjectId | string , data:any) => {
  try{
    await dbConnect();

    if (data.deleted === true) {
      data.deletedAt = new Date();
    } else if (data.deleted === false) {
      data.deletedAt = null;
    }

    const updateMedicine = await Medicine.findByIdAndUpdate(id , data , {new :true});

    if(!updateMedicine) {
      throw new Error("Medicine not found");
    }

    return {
      success: true,
      message: "Medicine updated successfully",
      updateMedicine,
    };
  } catch (error) {
    console.error("Error updating medicine:", error);
    return {
      success: false,
      message: "Error updating medicine",
    };
  }
};

export const deleteMedicine = async (id: string | Types.ObjectId) => {
  try {
    await dbConnect();

    const deletedMedicine = await Medicine.findByIdAndUpdate(
      id,
      {
        deleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!deletedMedicine) {
      throw new Error("Medicine not found");
    }

    return {
      success: true,
      message: "Medicine soft deleted successfully",
      deletedMedicine,
    };
  } catch (error) {
    console.error("Error deleting medicine:", error);
    return {
      success: false,
      message: "Error deleting medicine",
    };
  }
};

export const restoreMedicine = async (id: string | Types.ObjectId) => {
  try {
    await dbConnect();

    const restoredMedicine = await Medicine.findByIdAndUpdate(
      id,
      { deleted: false, deletedAt: null },
      { new: true }
    );

    if (!restoredMedicine) {
      throw new Error("Medicine not found");
    }

    return {
      success: true,
      message: "Medicine restored successfully",
      restoredMedicine,
    };
  } catch (error) {
    console.error("Error restoring medicine:", error);
    return {
      success: false,
      message: "Error restoring medicine",
    };
  }
};

