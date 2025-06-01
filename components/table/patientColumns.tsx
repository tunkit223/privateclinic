"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IPatient, IPatientDoc } from "@/database/patient.model";
import { Button } from "../ui/button";
import { Trash2, FilePen } from "lucide-react";
import EditPatientModal from "../Modal/EditPatientModal";
import { deletePatient } from "@/lib/actions/patient.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ActionCell = ({ item }: { item: IPatientDoc }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<IPatientDoc | null>(null);

  const handleDelete = async () => {
    setIsEditing(false);
    setEditingData(null);
    const res = await deletePatient(item._id);
    if (res.success) {
      alert("Deleted Successfully");
      router.refresh();
    } else {
      alert("Failed to delete");
    }
  };

  const handleEdit = () => {
    setEditingData(item);
    setIsEditing(true);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-700 text-white rounded-lg justify-center"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleEdit}
        className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg"
      >
        <FilePen className="h-4 w-4" />
      </Button>

      {isEditing && (
        <EditPatientModal
          initialData={editingData}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={(updatedData: IPatientDoc) => {
            setEditingData(updatedData);
            setIsEditing(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
};

export const columns: ColumnDef<IPatientDoc>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <p className="text-14-medium">{row.original.name}</p>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-14-regular min-w-[100px]">
        {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.phone ?? "";
      return (
        <p className="text-14-regular min-w-[100px]">
          {phone.toString()}
        </p>
      );
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {row.original.gender}
      </p>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.address ?? "";
      const maxLength = 50;
      return address.length > maxLength
        ? address.slice(0, maxLength) + "..."
        : address;
    },
  },
  {
    accessorKey: "birthdate",
    header: "Birthdate",
    cell: ({ row }) => {
      const rawDate = row.original.birthdate;
      const date = rawDate instanceof Date
        ? rawDate
        : new Date(rawDate);
      const formattedDate = date.toLocaleDateString("en-GB");
      return (
        <p className="text-14-regular min-w-[100px]">
          {formattedDate}
        </p>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => <ActionCell item={row.original} />,
  },
];
