"use server";
import UsageMethod from "@/database/usageMethod.model";
import dbConnect from "../mongoose";


export async function createUsageMethod(data: any) {
  try {
    await dbConnect();
    const newUsageMethod = await UsageMethod.create({
      name: data.name,
    })
    return {
      _id: newUsageMethod._id.toString(),
      name: newUsageMethod.name,
    };
  } catch (error) {
    console.error("Error create usage method:", error);
    throw error;
  }
}

export async function getUsageMethodList() {
  try {
    await dbConnect();
    const usageMethods = await UsageMethod.find()
      .lean();
    return JSON.parse(JSON.stringify(usageMethods));
  } catch (error) {
    console.error("Error fetching usage method:", error);
    return null;
  }
}