"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IUser, IUserDoc } from "@/database/user.model"
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { FilePen, Trash2 } from "lucide-react";
import { deleteUser, getUserByAccountId } from "@/lib/actions/user.action";

export default function ActionsCell({ item }: { item: any }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await getUserByAccountId(params?.accountId as string);
        setIsAdmin(user?.role === "admin");
      } catch (err) {
        console.error("Lỗi khi fetch user:", err);
      }
    };
    fetchUserRole();
  }, []);

  if (!isAdmin) return <div className="text-gray-400 italic">No action</div>;

  return (
    <div className="flex gap-2">
      <ActionCell item={item} />
      <ConfirmDeleteButton userId={item._id.toString()} />
    </div>
  );
}
interface ConfirmButtonProps {
 userId: string;
 disabled?: boolean;
}
export function ConfirmDeleteButton({ userId ,disabled}: ConfirmButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  
  const handleDelete = async () => {
    const toastId = toast.loading("Đang xoá...");
    const res = await deleteUser(userId);
    toast.dismiss(toastId);

    if (res.success) {
      toast.success("Deleted successfully!");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(res.message || "Xoá thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Nút xoá hiển thị trong bảng */}
      <DialogTrigger asChild>
        <Button
          className="bg-red-500 hover:bg-red-700 text-white"
          size="sm"
          disabled={disabled}
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
            Are you sure you want to delete this user, delete doctor also delete his pending appointments?
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

const ActionCell = ({
  item,
  disabled = false,
}: {
  item: IUserDoc;
  disabled?: boolean;
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<IUserDoc | null>(null);



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
        disabled={disabled}
      >
        <FilePen className="h-4 w-4" />
      </Button>

      {/* {isEditing && editingData && (
        <EditMedicineModal
          initialData={editingData}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={() => router.refresh()}
          medicineTypes={medicineTypes}
        />
      )} */}
    </div>
  );
};
export const columns: ColumnDef<IUserDoc>[] = [
  {
    header: "ID",
    cell: ({row}) => <p className="text-14-medium">{row.index+1}</p>
  },
  {
    accessorKey: "name",
    header: "Name",
    accessorFn: (row) => {
      return  row.name;
    },
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.name}</p>;
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({row}) =>{
      return(
      <div className="text-14-regular min-w-[100px]">
        {row.original.username}
      </div>)
    }
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell:({row}) =>(
      <p className="text-14-regular min-w-[100px]">
        {row.original.phone}
      </p>
    )
  },
  {
    accessorKey: "role",
    header: "Role",
    cell:({row}) =>(
      <p className="text-14-regular min-w-[100px]">
        {row.original.role}
      </p>
    )
  },
  {
    accessorKey: "image",
    header: "Image",
    cell:({row}) =>(
      <Image
        src={row.original.image || "/images/user.png"}
        alt="user image"
        width={40}
        height={40}
        className="rounded-full"/>
    )
  },
  {
    accessorKey: "address",
    header: "Address",
    cell:({row}) =>(
      <p className="text-14-regular min-w-[100px]">
        {row.original.address}
      </p>
    )
  },
  {
  id: "actions",
  header: "Actions",
  cell: ({ row }) => <ActionsCell item={row.original} />
}
]
