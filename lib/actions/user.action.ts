'use server'
import Account, { IAccount } from "@/database/account.modal";
import dbConnect from "../mongoose";
import User from "@/database/user.model";
import mongoose from "mongoose";

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
        tag: data.tag,
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

