"use server"

import User from "@/database/user.model"; // model User đã có role: "doctor"
import WorkSchedules from "@/database/workschedules";
import mongoose from "mongoose";
import dbConnect from "../mongoose";

export async function getAvailableDoctors(date: Date, shift: "Morning" | "Afternoon") {
  const targetDate = new Date(date.toDateString()); // bỏ giờ, chỉ so sánh ngày

  const schedules = await WorkSchedules.find({
  date: {
    $gte: targetDate,
    $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
  },
  shift: shift,
  })
  .populate({
    path: "doctor",
    match: { role: "doctor" },
    select: "_id name image",
  })
  .lean(); 


  return schedules
    .map(s => s.doctor)
    .filter(d => d !== null && d !== undefined)
    .map(d => ({
      ...d,
      _id: d._id.toString(), 
    }));

}


export async function getDoctorInfo(doctorId: string) {
  try {
    const doctor = await User.findById(doctorId)
      .select("name image")
      .lean<{ name: string; image: string }>(); 

    if (!doctor) return null;

    return {
      name: doctor.name,
      image: doctor.image,
    };
  } catch (error) {
    console.error("Lỗi khi lấy thông tin bác sĩ:", error);
    return null;
  }
}


export async function addSchedule({
  doctorId,
  date,
  shift,
}: {
  doctorId: string;
  date: string;
  shift: "Morning" | "Afternoon";
}) {
  await dbConnect();

  // Kiểm tra đã có lịch chưa
  const existing = await WorkSchedules.findOne({
    doctor: doctorId,
    date: new Date(date),
    shift,
  });

  if (existing) {
    console.log("Đã tồn tại lịch ca này.");
    return;
  }

  const newSchedule = new WorkSchedules({
    doctor: doctorId,
    date: new Date(date),
    shift,
  });

  await newSchedule.save();
}


export async function deleteSchedule({
  doctorId,
  date,
  shift,
}: {
  doctorId: string;
  date: string;
  shift: "Morning" | "Afternoon";
}) {
  await dbConnect();

  await WorkSchedules.findOneAndDelete({
    doctor: doctorId,
    date: new Date(date),
    shift,
  });
}


export async function getSchedules() {
  await dbConnect();

  const schedules = await WorkSchedules.find({}).populate("doctor");

   return schedules
    .filter(schedule => schedule.doctor) 
    .map((schedule) => ({
      title: `${schedule.doctor.name} (${schedule.shift})`,
      start: schedule.date.toISOString().split("T")[0],
      allDay: true,
      extendedProps: {
        doctorId: schedule.doctor._id.toString(),
        shift: schedule.shift,
      },
    }));
}