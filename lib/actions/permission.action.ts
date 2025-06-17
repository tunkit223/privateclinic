'use server'
import { parseStringify } from "../utils"
import dbConnect from "../mongoose";
import { Types } from "mongoose";
import Permissions, { IPermissionsDoc } from "@/database/permissions";
export const createPermission = async (userId: string, role: string) => {
  await dbConnect();
  const rights = {
    admin: [
      "Dashboard", "Appointment", "Medical Report", "Prescription",
      "Invoice", "Patient", "Medicine", "Medicine Type",
      "Work Schedule", "Employees", "Import", "Profile", "Change", "Permissions"
    ],
    doctor: [
      "Dashboard", "Appointment", "Medical Report", "Prescription",
      "Patient", "Medicine", "Medicine Type", "Work Schedule", "Employees", "Profile"
    ],
    receptionist: [
      "Dashboard", "Appointment", "Invoice", "Patient",
      "Medicine", "Medicine Type", "Work Schedule", "Employees", "Import", "Profile"
    ]
  }[role];

  if (!rights) throw new Error("Invalid role");

  const permissionDoc = await Permissions.create({
    UserId: userId,
    Right: rights,
  });
  return parseStringify(permissionDoc);
}


export const getPermissionByUserId = async (userId: string) => {
  try {
    await dbConnect();
    const objectId = new Types.ObjectId(userId);
    let permission = await Permissions.findOne({ UserId: objectId }).lean();

    if (!permission) {
      const newPermission = await Permissions.create({ UserId: objectId, Right: [] });
      permission = newPermission.toObject();
    }

    return permission?.Right || [];
  } catch (error) {
    console.error("Lỗi lấy quyền:", error);
    return [];
  }
};

export const updatePermission = async (userId: string, rights: string[]) => {
  try {
    await dbConnect();


    const updated = await Permissions.findOneAndUpdate(
      { UserId: userId },
      { $set: { Right: rights } },
      { new: true, upsert: true }
    );

    return JSON.stringify(updated);
  } catch (error) {
    console.error("Lỗi khi cập nhật quyền người dùng:", error);
    throw new Error("Lỗi khi cập nhật quyền người dùng");
  }
};