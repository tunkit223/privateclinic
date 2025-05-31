"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IMedicineDoc } from "@/database/medicine";
import { useState } from "react";
import { Button } from "../ui/button";
import { Trash2, FilePen } from "lucide-react";
import EditMedicineModal from "../Modal/EditMedicineModal";
import { deleteMedicine } from "@/lib/actions/medicine.action";
import { useRouter } from "next/navigation";

const ActionCell = ({
  item,
  medicineTypes,
}: {
  item: IMedicineDoc;
  medicineTypes: { _id: string; name: string }[];
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<IMedicineDoc | null>(null);

  const handleDelete = async () => {
    setIsEditing(false);
    setEditingData(null);
    const res = await deleteMedicine(item._id);
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

      {isEditing && editingData && (
        <EditMedicineModal
          initialData={editingData}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={() => router.refresh()}
          medicineTypes={medicineTypes}
        />
      )}
    </div>
  );
};

export const getMedicineColumns = (
  medicineTypes: { _id: string; name: string }[]
): ColumnDef<IMedicineDoc>[] => [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <p className="text-14-medium">{row.original.name}</p>,
  },
  {
    accessorKey: "medicineTypeId",
    header: "Type",
    cell: ({ row }) => {
      const type = medicineTypes.find(
        (t) => t._id === row.original.medicineTypeId?.toString()
      );
      return <p className="text-14-medium">{type?.name || "Unknown"}</p>;
    },
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => <p className="text-14-medium">{row.original.unit}</p>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <p className="text-14-medium">{row.original.amount}</p>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <p className="text-14-medium">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(row.original.price)}
      </p>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell item={row.original} medicineTypes={medicineTypes} />
    ),
  },
];
