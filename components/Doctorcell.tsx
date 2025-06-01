// DoctorCell.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getDoctorInfo } from "@/lib/actions/workschedules.action";

interface Props {
  doctorId: string;
}

export default function DoctorCell({ doctorId }: Props) {
  const [doctor, setDoctor] = useState<{ name: string; image?: string } | null>(null);

  useEffect(() => {
    async function fetchDoctor() {
      const data = await getDoctorInfo(doctorId);
      setDoctor(data);
    }
    fetchDoctor();
  }, [doctorId]);

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="flex items-center gap-3">
      <Image
        src={doctor.image || "/assets/images/employee.png"}
        alt={doctor.name}
        width={32}
        height={32}
        className="rounded-full border border-dark-200"
      />
      <p className="whitespace-nowrap">Dr. {doctor.name}</p>
    </div>
  );
}
