"use client";

import { deleteAppointment } from "@/lib/actions/appointment.action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  appointmentId: string;
}

const DeleteAppointmentForm = ({ appointmentId }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
  try {
    setIsDeleting(true);
    const res = await deleteAppointment(appointmentId);

    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message); 
    }
  } catch (err) {
    console.error(err);
    toast.error("Unexpected error while deleting appointment.");
  } finally {
    setIsDeleting(false);
  }
};

  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <p className="text-lg font-semibold mb-4">
        Are you sure to delete this appointment?
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          Yes
        </button>
        
      </div>
    </div>
  );
};

export default DeleteAppointmentForm;
