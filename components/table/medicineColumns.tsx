"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IMedicineDoc } from "@/database/medicine";
import { useState , useEffect} from "react";
import { Button } from "../ui/button";
import { Trash2, FilePen } from "lucide-react";
import EditMedicineModal from "../Modal/EditMedicineModal";
import { deleteMedicine , checkMedicineInUnpaidPrescriptions } from "@/lib/actions/medicine.action";
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

interface ConfirmButtonProps {
 medicineId: string;
}

export function ConfirmDeleteButton({ medicineId }: ConfirmButtonProps) {
  const [open, setOpen] = useState(false);
  const [unpaidState, setUnpaidState] = useState<{ inUse: boolean; prescriptionId?: string; prescriptionCode?: string;}>({
    inUse: false,
    prescriptionId: undefined,
    prescriptionCode: undefined,
  });
  const router = useRouter();

  useEffect(() => {
    if (open) {
      checkMedicineInUnpaidPrescriptions(medicineId).then((result) => {
        // ✅ result là { inUse: boolean; prescriptionId?: string }
        setUnpaidState(result);
      });
    }
  }, [open, medicineId]);

  const handleDelete = async () => {
    const res = await deleteMedicine(medicineId);

    if (res.success) {
      toast.success("Deleted successfully!");
      setOpen(false);
      router.refresh();
    } else {
      toast.error("Failed to delete");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Nút xoá hiển thị trong bảng */}
      <DialogTrigger asChild>
        <Button
          className="bg-red-500 hover:bg-red-700 text-white"
          size="sm"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      {/* Hộp thoại xác nhận */}
      <DialogContent className="space-y-4 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <DialogHeader>
            <DialogTitle className="text-center text-base">
            ❌ Confirm Delete
            </DialogTitle>
            <DialogDescription className="text-center text-base">
            Are you sure you want to delete this medicine ?
            </DialogDescription>
          </DialogHeader>
          {unpaidState.inUse && (
          <div className="text-red-500 text-sm text-center font-semibold">
            ⚠️ This medicine is part of an unpaid prescription (Code: {unpaidState.prescriptionCode})
          </div>
        )}

        <DialogFooter className="sm:justify-center gap-4">
          <Button className="bg-blue-300 hover:bg-blue-400"  variant="destructive" onClick={handleDelete}>
            Yes, delete
          </Button>
          <Button className="hover:bg-gray-400" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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



  const handleEdit = () => {
    setEditingData(item);
    setIsEditing(true);
  };

  return (
    <div className="flex gap-2">
       
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
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <ActionCell item={row.original} medicineTypes={medicineTypes} />
          <ConfirmDeleteButton medicineId={row.original._id.toString()} />
        </div>
      );
    }
  },

];
