import Patient from "@/database/patient.model";
import { getPatientList } from "./patient.actions";
import { subDays, startOfMonth, endOfMonth, format, isWithinInterval } from "date-fns";
import { date } from "zod";
import { getDateRanges, getFigureByModel } from "../utils";
import Appointment from "@/database/appointment.model";
import User from "@/database/user.model";
import MedicineBatch from "@/database/medicineBatch";
import dbConnect from "../mongoose";

// function formatDate(date: Date): string {
//   return date.toLocaleDateString("vi-VN"); // "5/5/2025"
// }

// function getDateRange(from: Date, to: Date): string[] {
//   const dates: string[] = [];
//   const current = new Date(from);
//   while (current <= to) {
//     dates.push(formatDate(new Date(current)));
//     current.setDate(current.getDate() + 1);
//   }
//   return dates;
// }

// export async function getExpenseFromDatetoDate(fromDate: Date, toDate: Date) {
//   await dbConnect();

//   const batches = await MedicineBatch.find({
//     status: "đã nhập",
//     importDate: {
//       $gte: fromDate,
//       $lte: toDate,
//     },
//   }).lean();

//   // Gom chi phí theo ngày
//   const expenseMap = new Map<string, number>();
//   for (const batch of batches) {
//     const date = formatDate(new Date(batch.importDate));
//     const value = batch.totalValue || 0;
//     expenseMap.set(date, (expenseMap.get(date) || 0) + value);
//   }

//   // Đảm bảo có đủ ngày trong khoảng, kể cả khi value = 0
//   const allDates = getDateRange(fromDate, toDate);
//   const result = allDates.map((date) => ({
//     date,
//     value: expenseMap.get(date) || 0,
//     type: "expense" as const,
//   }));

//   return result;
// }

export async function getPatientByDateRange(start: Date, end: Date) {
  // const patientGender = await getPatientList();
  const { documents: patientGender } = await getPatientList();

  const filtered = patientGender.filter((p: any) =>
    isWithinInterval(p.createdAt, { start, end })
  );

  const grouped: Record<string, { male: number; female: number }> = {};

  for (const patient of filtered) {
    const key = format(patient.createdAt, "dd/MM/yyyy");
    if (!grouped[key]) {
      grouped[key] = { male: 0, female: 0 };
    }
    const gender = patient.gender.toLowerCase() as 'male' | 'female';
    if (gender === "male" || gender === "female") {
      grouped[key][gender]++;
    }
  }
  const result = Object.entries(grouped).map(([date, { male, female }]) => ({
    date,
    male,
    female
  }));
  result.sort((a, b) => a.date.localeCompare(b.date));
  return result;
};
export async function getExpense() {
  const expenseData = [
    { date: '1/5/2025', value: 90, type: 'expense' },
    { date: '2/5/2025', value: 150, type: 'expense' },
    { date: '3/5/2025', value: 200, type: 'expense' },
    { date: '4/5/2025', value: 170, type: 'expense' },
    { date: '5/5/2025', value: 300, type: 'expense' },
    { date: '6/5/2025', value: 240, type: 'expense' },
    { date: '7/5/2025', value: 180, type: 'expense' },
    { date: '8/5/2025', value: 210, type: 'expense' },
    { date: '9/5/2025', value: 280, type: 'expense' },
    { date: '10/5/2025', value: 190, type: 'expense' },
    { date: '11/5/2025', value: 230, type: 'expense' },
    { date: '12/5/2025', value: 260, type: 'expense' },
    { date: '13/5/2025', value: 220, type: 'expense' },
  ];
  return expenseData;
};
export async function getRevenue() {
  const revenueData = [
    { date: '1/5/2025', value: 120, type: 'revenue' },
    { date: '2/5/2025', value: 200, type: 'revenue' },
    { date: '3/5/2025', value: 310, type: 'revenue' },
    { date: '4/5/2025', value: 150, type: 'revenue' },
    { date: '5/5/2025', value: 480, type: 'revenue' },
    { date: '6/5/2025', value: 290, type: 'revenue' },
    { date: '7/5/2025', value: 370, type: 'revenue' },
    { date: '8/5/2025', value: 260, type: 'revenue' },
    { date: '9/5/2025', value: 430, type: 'revenue' },
    { date: '10/5/2025', value: 220, type: 'revenue' },
    { date: '11/5/2025', value: 390, type: 'revenue' },
    { date: '12/5/2025', value: 310, type: 'revenue' },
    { date: '13/5/2025', value: 350, type: 'revenue' },
  ];
  return revenueData;
};


export async function getIncome() {
  const revenueData = await getRevenue();
  const expenseData = await getExpense();
  const incomeData = revenueData.map(rev => {
    const exp = expenseData.find((e) => e.date === rev.date);
    return {
      date: rev.date,
      income: rev.value - (exp?.value || 0),
    };
  })
  return incomeData;
};


export const getFigurePatientToday = () => getFigureByModel(Patient);
export const getFigureAppointmentToday = () => getFigureByModel(Appointment);
export const getFigureDoctorToday = () => getFigureByModel(User);
