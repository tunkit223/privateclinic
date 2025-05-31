import Counter from "@/database/counter.model";
import RefAutoComplete from "antd/es/auto-complete/AutoComplete";
import { type ClassValue, clsx } from "clsx";
import { Percent } from "lucide-react";
import { Model } from "mongoose";
import { resourceUsage } from "process";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function getCookieParsed<T = any>(name: string): T | null {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find(row => row.startsWith(name + "="));

  if (!cookie) return null;

  try {
    const value = cookie.split("=")[1];
    return JSON.parse(decodeURIComponent(value)) as T;
  } catch (error) {
    console.error("Failed to parse cookie", error);
    return null;
  }
}


// FORMAT DATE TIME
export const formatDateTime = (dateString: Date | string) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    // weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    year: "numeric", // numeric year (e.g., '2023')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}


export function getDateRanges() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return { yesterday, today, tomorrow };
}

export const getFigureByModel = async <T>(Model: Model<T>, filter: Record<string, any> = {}) => {
  const { yesterday, today, tomorrow } = getDateRanges();

  try {
    const totalToday = await Model.countDocuments({
      ...filter,
      createdAt: { $gte: today, $lt: tomorrow }
    });
    const totalYesterday = await Model.countDocuments({
      ...filter,
      createdAt: { $gte: yesterday, $lt: today }
    });
    let percentageChange = 0;
    if (totalYesterday === 0) {
      percentageChange = totalToday > 0 ? 100 : 0
    } else {
      percentageChange = ((totalToday - totalYesterday) / totalYesterday) * 100;
    }

    return {
      total: totalToday,
      percent: parseFloat(percentageChange.toFixed(2)),
    };
  } catch (error) {
    console.log(`Error fetch figure by ${Model.modelName}:`, error);
    return null;
  }
}


export const generatePrescriptionId = async () => {
  const result = await Counter.findByIdAndUpdate(
    { _id: "prescription" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const code = "Rx" + String(result.seq).padStart(6, "0");
  return code;
}

import MedicalReport from "@/database/medicalReport.modal";
import PatientReport from "@/database/patientReport.model";
import Appointment from "@/database/appointment.model";

export async function addData() {
  const reports = await MedicalReport.find();
  for (const report of reports) {
    const appointment = await Appointment.findById(report.appointmentId);

    if (!appointment) {
      console.log("Appointment not found for report:", report.appointmentId);
      continue;
    }
    const patientId = appointment.patientId;
    if (!patientId) {
      console.log("Patient ID not found for appointment:", appointment._id);
      continue;
    }
    const existing = await PatientReport.findOne({
      patientId,
      medicalReportId: report._id
    });
    if (!existing) {
      await PatientReport.create({
        patientId,
        medicalReportId: report._id,
      })
      console.log("Created PatientReport for patientId:", patientId, "and medicalReportId:", report._id);
    }
  }
  console.log("Data added successfully");
}