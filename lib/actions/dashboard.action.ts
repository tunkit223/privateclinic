import { getPatientList } from "./patient.actions";
import { subDays, startOfMonth, endOfMonth, format, isWithinInterval } from "date-fns";
import { date } from "zod";
import { formatDate, getDateRange, getDateRanges, getFigureByModel } from "../utils";
import Patient from "@/database/patient.model";
import Appointment from "@/database/appointment.model";
import dbConnect from "../mongoose";
import Invoice from "@/database/invoice.model";

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



// export const getFigurePatientToday = () => getFigureByModel(Patient);
export const getFigurePatientToday = async () => {
  const { yesterday, today, tomorrow } = getDateRanges();

  try {
    const patientToday = await getPatientByDateRange(today, tomorrow);
    const patientYesterday = await getPatientByDateRange(yesterday, today);
    const totalToday = patientToday.reduce((sum, item) => sum + item.male + item.female, 0);

    const totalYesterday = patientYesterday.reduce((sum, item) => sum + item.male + item.female, 0);


    let percentageChange = 0;
    if (totalYesterday === 0) {
      percentageChange = totalToday > 0 ? 100 : 0
    } else {
      percentageChange = ((totalToday - totalYesterday) / totalYesterday) * 100;
    }

    return {
      totalToday: totalToday,
      totalYesterday: totalYesterday,
      percentChange: parseFloat(percentageChange.toFixed(2)),
    };
  } catch (error) {
    console.log(`Error fetch patient figure`, error);
    return null;
  }
}
export const getFigureAppointmentToday = () => getFigureByModel(Appointment);
