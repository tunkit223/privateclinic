// components/DoctorCalendar.tsx
"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { addSchedule, deleteSchedule, getSchedules } from "@/lib/actions/workschedules.action";

export default function DoctorCalendar() {
  const [events, setEvents] = useState<any[]>([]);

  // Load dữ liệu lịch khi component mount
  useEffect(() => {
    const loadSchedules = async () => {
      const existingSchedules = await getSchedules();
      setEvents(existingSchedules);
    };

    loadSchedules();
  }, []);

  const handleEventReceive = async (info: any) => {
    const doctorId = info.event.extendedProps.doctorId;
    const title = info.event.title;
    const date = info.event.startStr;
    const shift = info.event.extendedProps.shift;

    const isDuplicate = events.some(
      (event) =>
        event.extendedProps?.doctorId === doctorId &&
        event.start === date &&
        event.extendedProps?.shift === shift
    );

    if (isDuplicate) {
      alert("Bác sĩ đã được đặt ở ca này!");
      info.event.remove();
      return;
    }

    const newEvent = {
      title: `${title} (${shift})`,
      start: date,
      allDay: true,
      extendedProps: { doctorId, shift },
    };

    setEvents((prev) => [...prev, newEvent]);
    await addSchedule({ doctorId, date, shift });
  };

  const handleDelete = async (event: any) => {
    const doctorId = event.extendedProps.doctorId;
    const date = event.startStr || event.start;
    const shift = event.extendedProps.shift;

    const confirm = window.confirm("Xoá ca làm việc này?");
    if (!confirm) return;

    await deleteSchedule({ doctorId, date, shift });
     const updatedSchedules = await getSchedules();
    setEvents(updatedSchedules);
  };

  const renderEventContent = (eventInfo: any) => (
    <div className="flex justify-between items-center text-xs">
      <span>{eventInfo.event.title}</span>
      <button
        onClick={() => handleDelete(eventInfo.event)}
        className="text-red-500 ml-2 hover:underline text-xs"
      >
        ❌
      </button>
    </div>
  );

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      editable={true}
      droppable={true}
      eventReceive={handleEventReceive}
      eventContent={renderEventContent}
      events={events}
    />
  );
}
