"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
  updateMedicineBatchStatus,
  deleteMedicineBatch,
  increaseMedicineAmountFromBatchItems,
} from "@/lib/actions/medicineBatch.action";
import { IMedicineBatch } from "@/database/medicineBatch";
import { useRouter } from "next/navigation";
import { CheckCircle2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { DataTable } from "@/components/table/ImportTable";
import StatusBadge from "../StatusBadge";
import { Dialog, DialogTrigger, DialogContent, DialogFooter , DialogClose , DialogHeader , DialogTitle , DialogDescription} from "@/components/ui/dialog"
import { toast } from "react-hot-toast";
import { useState } from "react";
import { getMedicineById } from "@/lib/actions/medicine.action";

interface ConfirmButtonProps {
  batchId: string;
  
}
interface Props {
  
  data: IMedicineBatch[];
  medicineTypes: { _id: string; name: string }[];
}
export function ConfirmDeleteButton({ batchId }: ConfirmButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const res = await deleteMedicineBatch(batchId);
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
            Are you sure you want to delete this medicine batch?
            </DialogDescription>
          </DialogHeader>

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

export function ConfirmImportButton({ batchId  }: ConfirmButtonProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleConfirm = async () => {
    
    const res = await updateMedicineBatchStatus(batchId, "imported")
    if (res.success) {
      const increaseRes = await increaseMedicineAmountFromBatchItems(batchId)
      if (increaseRes.success) {
        toast.success("Medicine batch confirmed and stock updated.")
      } else {
        toast.error(`Failed to update stock: ${increaseRes.message}`)
      }
      setOpen(false)
      router.refresh()
    } else {
      if (res.deleted) {
        toast.error("The associated medicine has been deleted or no longer exists.");
      } else {
        toast.error("Failed to update the batch status.");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-green-500 hover:bg-green-700 text-white"
          size="sm"
        >
          <CheckCircle2 className="w-4 h-4 mr-1" />
          Confirm
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-center text-base">
              ✅ Confirm Import
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Are you sure you want to confirm this import? This will update the medicine stock.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-center gap-4 mt-4">
            <Button className="bg-blue-300 hover:bg-blue-400 text-black" onClick={handleConfirm}>
              Yes, confirm
            </Button>
            <DialogClose asChild>
              <Button className="hover:bg-gray-400" variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
// 👇 Hàm tạo columns
export const columns = (
  medicineTypes: Props["medicineTypes"]
): ColumnDef<IMedicineBatch>[] => [
  {
    header: "STT",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "medicineName",
    header: "Medicine Name",
    cell: ({ row }) => (
      <p className="text-14-medium">{(row.original as any).medicineName}</p>
    ),
  },
  {
    accessorKey: "medicineTypeName",
    header: "Medicine Type",
    cell: ({ row }) => (
      <p className="text-14-medium">{(row.original as any).medicineTypeName}</p>
    ),
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => (
      <p className="text-14-medium">{(row.original as any).unit}</p>
    ),
  },
  {
    accessorKey: "importDate",
    header: "Import Date",
    cell: ({ row }) => (
      <p className="text-14-medium">
        {format(new Date(row.original.importDate), "dd/MM/yyyy")}
      </p>
    ),
    filterFn: (row, columnId, value: [string, string]) => {
      const rowDate = new Date(row.getValue(columnId));
      const [start, end] = value;
      if (start && rowDate < new Date(start)) return false;
      if (end && rowDate > new Date(end)) return false;
      return true;
    },
  },
  {
    accessorKey: "importQuantity",
    header: "Quantity",
    cell: ({ row }) => (
      <p className="text-14-medium">{row.original.importQuantity}</p>
    ),
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }) => (
      <p className="text-14-medium">
        {row.original.expiryDate
          ? format(new Date(row.original.expiryDate), "dd/MM/yyyy")
          : "-"}
      </p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={row.original.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => (
      <p className="text-14-medium max-w-[150px] truncate">
        {row.original.note || "-"}
      </p>
    ),
  },
  {
    accessorKey: "totalValue",
    header: "Total Value (VND)",
    cell: ({ row }) => (
      <p className="text-14-medium">
        {row.original.totalValue
          ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(row.original.totalValue)
          : "-"}
      </p>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const batch = row.original;

      return (
        <div className="flex gap-2">
          {batch.status === "importing" && (
            <ConfirmImportButton batchId={batch._id.toString()} />
          )}
          {batch.status === "importing" && (
            <ConfirmDeleteButton batchId={batch._id.toString()} />
          )}
        </div>
      );
    },
  },
];

// ✅ Component chính để hiển thị bảng
const MedicineBatchTableClient = ({ data, medicineTypes }: Props) => {
  return <DataTable columns={columns(medicineTypes)} data={data} />;
};

export default MedicineBatchTableClient;
