// components/DoctorList.tsx
"use client";

import { useEffect, useRef } from "react";
import { Draggable } from "@fullcalendar/interaction";

export function DoctorList({ doctors }: { doctors: any[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      new Draggable(containerRef.current, {
        itemSelector: ".fc-draggable-doctor",
        eventData: function (el) {
          const doctorId = el.getAttribute("data-doctor-id");
          const doctorName = el.getAttribute("data-doctor-name");
          const shift = el.getAttribute("data-shift");
          return {
            title: doctorName,
            extendedProps: {
              doctorId,
              shift,
            },
          };
        },
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      {doctors.map((doctor) => (
        <div key={doctor._id} className="flex flex-col gap-1 p-2 bg-[#DEEEF8] rounded">
          <div className="font-semibold">{doctor.name}</div>
          <div className="flex gap-2">
            <div
              className="fc-draggable-doctor bg-white p-1 border rounded cursor-move"
              data-doctor-id={doctor._id}
              data-doctor-name={doctor.name}
              data-shift="Morning"
            >
              Morning
            </div>
            <div
              className="fc-draggable-doctor bg-white p-1 border rounded cursor-move"
              data-doctor-id={doctor._id}
              data-doctor-name={doctor.name}
              data-shift="Afternoon"
            >
              Afternoon
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
