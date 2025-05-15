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

export const getDoctorAvailable = async () => {
  const mockDataDoctor = [
    {
      name: "Dr. Emily Nguyen",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      workShift: "morning",
      totalPatient: 14,
      specialty: "Cardiology"
    },
    {
      name: "Dr. James Smith",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      workShift: "afternoon",
      totalPatient: 9,
      specialty: "Dermatology"
    },
    {
      name: "Dr. Olivia Tran",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      workShift: "morning",
      totalPatient: 12,
      specialty: "Pediatrics"
    },
    {
      name: "Dr. Michael Johnson",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      workShift: "afternoon",
      totalPatient: 17,
      specialty: "Orthopedics"
    },
    {
      name: "Dr. Sophia Lee",
      image: "https://randomuser.me/api/portraits/women/5.jpg",
      workShift: "morning",
      totalPatient: 10,
      specialty: "Neurology"
    },
    {
      name: "Dr. William Brown",
      image: "https://randomuser.me/api/portraits/men/6.jpg",
      workShift: "afternoon",
      totalPatient: 11,
      specialty: "General Surgery"
    },
    {
      name: "Dr. Ava Davis",
      image: "https://randomuser.me/api/portraits/women/7.jpg",
      workShift: "morning",
      totalPatient: 13,
      specialty: "Gastroenterology"
    },
    {
      name: "Dr. Benjamin Miller",
      image: "https://randomuser.me/api/portraits/men/8.jpg",
      workShift: "afternoon",
      totalPatient: 16,
      specialty: "Urology"
    },
    {
      name: "Dr. Isabella Wilson",
      image: "https://randomuser.me/api/portraits/women/9.jpg",
      workShift: "morning",
      totalPatient: 15,
      specialty: "Endocrinology"
    },
    {
      name: "Dr. Lucas Martinez",
      image: "https://randomuser.me/api/portraits/men/10.jpg",
      workShift: "afternoon",
      totalPatient: 10,
      specialty: "Oncology"
    },
    {
      name: "Dr. Mia Anderson",
      image: "https://randomuser.me/api/portraits/women/11.jpg",
      workShift: "morning",
      totalPatient: 18,
      specialty: "Pulmonology"
    },
    {
      name: "Dr. Henry Thomas",
      image: "https://randomuser.me/api/portraits/men/12.jpg",
      workShift: "afternoon",
      totalPatient: 8,
      specialty: "Ophthalmology"
    },
    {
      name: "Dr. Charlotte Garcia",
      image: "https://randomuser.me/api/portraits/women/13.jpg",
      workShift: "morning",
      totalPatient: 19,
      specialty: "Psychiatry"
    },
    {
      name: "Dr. Daniel Martinez",
      image: "https://randomuser.me/api/portraits/men/14.jpg",
      workShift: "afternoon",
      totalPatient: 7,
      specialty: "ENT"
    },
    {
      name: "Dr. Amelia Robinson",
      image: "https://randomuser.me/api/portraits/women/15.jpg",
      workShift: "morning",
      totalPatient: 20,
      specialty: "Nephrology"
    },
    {
      name: "Dr. Ethan Clark",
      image: "https://randomuser.me/api/portraits/men/16.jpg",
      workShift: "afternoon",
      totalPatient: 14,
      specialty: "Radiology"
    },
    {
      name: "Dr. Harper Lewis",
      image: "https://randomuser.me/api/portraits/women/17.jpg",
      workShift: "morning",
      totalPatient: 11,
      specialty: "Rheumatology"
    },
    {
      name: "Dr. Jack Walker",
      image: "https://randomuser.me/api/portraits/men/18.jpg",
      workShift: "afternoon",
      totalPatient: 13,
      specialty: "Hematology"
    },
    {
      name: "Dr. Evelyn Hall",
      image: "https://randomuser.me/api/portraits/women/19.jpg",
      workShift: "morning",
      totalPatient: 9,
      specialty: "Obstetrics & Gynecology"
    },
    {
      name: "Dr. Alexander Allen",
      image: "https://randomuser.me/api/portraits/men/20.jpg",
      workShift: "afternoon",
      totalPatient: 15,
      specialty: "Anesthesiology"
    }
  ];
  return mockDataDoctor;
}