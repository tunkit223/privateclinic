'use server'
import User from "@/database/user.model";
import dbConnect from "../mongoose";

export const getEmployeesList = async () => {
  try {
    await dbConnect();
    const employees = await User.find()
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

