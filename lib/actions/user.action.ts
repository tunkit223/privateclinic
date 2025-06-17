'use server'
import Account, { IAccount } from "@/database/account.model";
import dbConnect from "../mongoose";
import User, { IUser } from "@/database/user.model";
import mongoose, { Types } from "mongoose";

export async function createAccount(data: any) {
  try {
    await dbConnect();
    const existingAccount = await Account.findOne({ email: data.email });
    if (existingAccount) {
      throw new Error("Email đã được sử dụng.");
    }


    const newAccount = await Account.create(
      {
        email: data.email,
        password: data.password,
      }
    );

    return {
      ...newAccount.toObject(),
      _id: newAccount._id.toString()
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi tạo tài khoản");
  }
}

export async function createUser(data: any) {
  try {
    await dbConnect();
    const accountIdstring = typeof data.accountId === "object" ? data.accountId._id : data.accountId;
    const patientIdObject = new mongoose.Types.ObjectId(accountIdstring)

    const existingAccount = await Account.findOne({ phone: data.phone });
    if (existingAccount) {
      throw new Error("Phone đã được sử dụng.");
    }

    const newUser = await User.create({
      accountId: patientIdObject,
      name: data.name,
      username: data.username,
      role: data.role,
      phone: data.phone,
      address: data.address,
    });

    return {
      ...newUser.toObject(),
      _id: newUser._id.toString(),
      accountId: newUser.accountId.toString(),
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi tạo user");
  }
}


export const getUserByAccountId = async (accountId: string) => {
  try {
    await dbConnect();
    const user = await User.findOne({ accountId }).lean();
    if (!user) {
      throw new Error("User not found");
    }
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}


export async function updateUser(accountId: string, data: IUser) {
  try {
    await dbConnect();
    const updatedUser = await User.findOneAndUpdate(
      { accountId: new Types.ObjectId(accountId) },
      { $set: data },
      { new: true }
    )
    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)
    throw new Error("Không thể cập nhật thông tin người dùng.")
  }
}


export const checkOldPassword = async (accountId: string, oldPassword: string) => {
  try {
    await dbConnect();

    const account = await Account.findById(new mongoose.Types.ObjectId(accountId));
    if (!account) {
      return { success: false, message: "Account not found" };
    }

    if (account.password !== oldPassword) {
      return { success: false, message: "Incorrect password" };
    }

    return { success: true, email: account.email };
  } catch (err) {
    console.error("Error in checkOldPassword:", err);
    return { success: false, message: "Error checking password" };
  }
};

export const getAllUsers = async () => {
  try {
    await dbConnect();
    const users = await User.find({}, "_id name role").lean();
    return users.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      role: user.role,
    }));
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách người dùng");
  }
};
