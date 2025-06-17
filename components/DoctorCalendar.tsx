"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { addSchedule, deleteSchedule, getSchedules } from "@/lib/actions/workschedules.action";
import { useParams } from "next/navigation";
import { getUserByAccountId } from "@/lib/actions/user.action";
import toast from "react-hot-toast";

export default function DoctorCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const params = useParams();

  // Lấy role từ accountId
  const fetchUserRole = async () => {
    try {
      const user = await getUserByAccountId(params?.accountId as string);
      if (user?.role === "admin") {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  // Load lịch làm việc và role
  useEffect(() => {
    const loadSchedules = async () => {
      const existingSchedules = await getSchedules();
      setEvents(existingSchedules);
    };

    loadSchedules();
    fetchUserRole();
  }, []);

  // Xử lý kéo thả để thêm lịch
  const handleEventReceive = async (info: any) => {
    if (!isAdmin) {
      info.event.remove();
      toast.error("You do not have permission to add schedules");
      return;
    }

    const doctorId = info.event.extendedProps.doctorId;
    const title = info.event.title;
    const date = info.event.startStr;
    const shift = info.event.extendedProps.shift;

    const today = new Date();
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      info.event.remove();
      toast.error("Only future dates can be scheduled");
      return;
    }

    const isDuplicate = events.some(
      (event) =>
        event.extendedProps?.doctorId === doctorId &&
        event.start === date &&
        event.extendedProps?.shift === shift
    );

    if (isDuplicate) {
      toast.error("Schedule already exists for this doctor on this date and shift");
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

  // Xử lý xoá lịch
  const handleDelete = (event: any) => {
    if (!isAdmin) return;

    const doctorId = event.extendedProps.doctorId;
    const date = event.startStr || event.start;
    const shift = event.extendedProps.shift;

    const today = new Date();
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (eventDate <= today) {
      toast.error("Cannot delete past schedules!");
      return;
    }

    toast(
      (t) => (
        <span>
          Confirm delete schedule.
          <div className="mt-2 flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await deleteSchedule({ doctorId, date, shift });
                const updatedSchedules = await getSchedules();
                setEvents(updatedSchedules);
                toast.success("delete schedule successfully");
              }}
              className="bg-red-500 text-white px-2 py-1 rounded text-sm"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-200 text-black px-2 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </span>
      ),
      {
        duration: 10000,
      }
    );
  };

  // Hiển thị nội dung từng event
  const renderEventContent = (eventInfo: any) => (
    <div className="flex justify-between items-center text-xs">
      <span>{eventInfo.event.title}</span>
      {isAdmin && (
        <button
          onClick={() => handleDelete(eventInfo.event)}
          className="text-red-500 ml-1 hover:underline text-xs"
        >
          ❌
        </button>
      )}
    </div>
  );

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      editable={isAdmin}
      droppable={isAdmin}
      eventReceive={handleEventReceive}
      eventContent={renderEventContent}
      events={events}
    />
  );
}
