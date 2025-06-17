import DoctorCalendar from '@/components/DoctorCalendar';
import { DoctorList } from '@/components/DoctorList';
import User from '@/database/user.model';
import React from 'react'

const workschedule = async () => {
   const doctorsRaw = await User.find({ role: 'doctor',deleted: false }).lean();

  const doctors = doctorsRaw.map((doctor) => ({
    _id: String(doctor._id),
    name: doctor.name,
    username: doctor.username,
    phone: doctor.phone,
    role: doctor.role,
    address: doctor.address,
    createdAt: doctor.createdAt.toISOString?.(),
    updatedAt: doctor.updatedAt.toISOString?.(),
    accountId: doctor.accountId ? String(doctor.accountId) : null,
  }));
 
  return (
    <div className="flex gap-8 p-8">
      <div className="w-1/4">
        <h2 className="text-lg font-bold mb-4">Doctor List</h2>
        <DoctorList doctors={doctors} />
      </div>
      <div className="w-3/4">
        <DoctorCalendar />
      </div>
    </div>
  );
  
}

export default workschedule