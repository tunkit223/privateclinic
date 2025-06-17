"use server"

import User from "@/database/user.model"; // model User đã có role: "doctor"
import WorkSchedules from "@/database/workschedules";
import mongoose from "mongoose";
import dbConnect from "../mongoose";
import Appointment from "@/database/appointment.model";

export async function getAvailableDoctors(date: Date, shift: "Morning" | "Afternoon") {
  const targetDate = new Date(date.toDateString()) // reset giờ về 00:00:00

  const schedules = await WorkSchedules.find({
    date: {
      $gte: targetDate,
      $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
    },
    shift: shift,
  })
    .populate({
      path: "doctor",
      match: { role: "doctor", deleted: false }, 
      select: "_id name image",
    })
    .lean()

  return schedules
    .map(s => s.doctor)
    .filter(d => d !== null && d !== undefined)
    .map(d => ({
      name: d.name,
      image: d.image,
      workShift: shift.toLowerCase(),
      _id: d._id.toString(),
    }))
}
export async function getAvailableDoctorsdeleted(date: Date, shift: "Morning" | "Afternoon") {
  const targetDate = new Date(date.toDateString()) // reset giờ về 00:00:00

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
    .lean()

  return schedules
    .map(s => s.doctor)
    .filter(d => d !== null && d !== undefined)
    .map(d => ({
      name: d.name,
      image: d.image,
      workShift: shift.toLowerCase(),
      _id: d._id.toString(),
    }))
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


/*************  ✨ Windsurf Command ⭐  *************/
/**

/*******  946eb3ec-495c-4f7d-9902-81f427643807  *******/
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


export async function getAppointmentsByDoctorDateShift( doctorId:string, date: Date, shift: "Morning" | "Afternoon") {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  return await Appointment.find({
    doctor: doctorId,
    date: {
      $gte: targetDate,
      $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
    },
    shift,
  });
}