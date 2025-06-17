'use server'
import User from "@/database/user.model";
import dbConnect from "../mongoose";

export const getEmployeesList = async () => {
  try {
    await dbConnect();
    const employees = await User.find({ deleted: false }) 
      .sort({ createdAt: -1 })
      .lean();

    const data = {
      documents: employees,
    };

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching employees:", error);
    return null;
  }
};

export const getName = async (id: string) => {
  try {
    await dbConnect();
    const employee = await User.find(
      { _id: id },
    )
      .select("name")
      .lean();

    return JSON.parse(JSON.stringify(employee));
  } catch (error) {
    console.error("Error fetching employees:", error);
    return null;
  }
};




