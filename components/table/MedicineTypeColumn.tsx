'use client'

import { ColumnDef } from "@tanstack/react-table"
import { IMedicineTypeDoc } from "@/database/medicineType"
import { deleteMedicineType } from "@/lib/actions/medicineType.action"
import { useRouter } from "next/navigation"
import { Trash2, FilePen } from "lucide-react"
import { Button } from "../ui/button"
import { useState , useEffect } from "react"
import EditMedicineTypeModal from "@/components/Modal/EditMedicineTypeModal" // đảm bảo tên 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "../ui/dialog"
import { toast } from "react-hot-toast"
import { checkMedicineTypeInUse } from "@/lib/actions/medicineType.action"
export interface ConfirmButtonProps {
  medicineTypeId: string;
}

export function ConfirmDeleteButton({ medicineTypeId }: ConfirmButtonProps) {
  const [open, setOpen] = useState(false);
  const [inUseInfo, setInUseInfo] = useState<{
    inUse: boolean;
    sampleMedicineName?: string;
  }>({ inUse: false });
  const router = useRouter();

  useEffect(() => {
    if (open) {
      checkMedicineTypeInUse(medicineTypeId).then((res) => {
        setInUseInfo(res);
      });
    }
  }, [open, medicineTypeId]);

  const handleDelete = async () => {
    const res = await deleteMedicineType(medicineTypeId);
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
            Are you sure you want to delete this medicine type?
            </DialogDescription>
          </DialogHeader>
          {inUseInfo.inUse && (
          <div className="text-sm text-red-600 text-center font-semibold">
            ⚠️ This type is currently in use by medicine "{inUseInfo.sampleMedicineName}"
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


export const columns: ColumnDef<IMedicineTypeDoc>[] = [
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {row.original.description}
      </p>
    ),
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const item = row.original
      const router = useRouter()
      const [isEditing, setIsEditing] = useState(false)

      const handleEdit = () => {
        setIsEditing(true)
      }

      return (
        <>
          <div className="flex gap-2">

            <Button
              variant={"outline"}
              size={"sm"}
              onClick={handleEdit}
              className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg"
            >
              <FilePen className="h-4 w-4" />
            </Button>
            <ConfirmDeleteButton medicineTypeId={item._id.toString()} />
          </div>

          {isEditing && (
            <EditMedicineTypeModal
              initialData={item}
              isOpen={isEditing}
              onClose={() => setIsEditing(false)}
              onSave={() => {
                setIsEditing(false)
                router.refresh()
              }}
            />
          )}
        </>
      )
    },
  },
]
