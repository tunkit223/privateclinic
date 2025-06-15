"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IPatient, IPatientDoc } from "@/database/patient.model";
import { Button } from "../ui/button";
import { Trash2, FilePen } from "lucide-react";
import EditPatientModal from "../Modal/EditPatientModal";
import { deletePatient } from "@/lib/actions/patient.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ExamHistoryModal from "../ExamHistoryModal";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

interface ConfirmButtonProps {
  patientId: string;
 }
 
 export function ConfirmDeleteButton({ patientId }: ConfirmButtonProps) {
   const [open, setOpen] = useState(false);
   const router = useRouter();
 
   const handleDelete = async () => {
     const res = await deletePatient(patientId);
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
             Are you sure you want to delete this patient ?
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
 

const ActionCell = ({ item }: { item: IPatientDoc }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<IPatientDoc | null>(null);

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
      <ConfirmDeleteButton patientId={item._id.toString()} />
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
      <ExamHistoryModal patientId={`${item._id.toString()}`}/>
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
