"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IMedicineType, IMedicineTypeDoc } from "@/database/medicineType"
import { deleteMedicineType } from "@/lib/actions/medicineType.action";
import { Router } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Trash2 , FilePen} from "lucide-react";
import { useState } from "react";
import EditMedicineTypeServer from "../forms/EditForms/EditMedicineTypeForm";


export const columns: ColumnDef<IMedicineTypeDoc>[] = [
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
    accessorKey: "description",
    header: "Description",
    cell:({row}) =>(
      <p className="text-14-regular min-w-[100px]">
        {row.original.description}
      </p>
    )
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const item = row.original;
      const myRouter = useRouter();

      const [isEditing, setIsEditing] = useState(false);
      const [editingData, setEditingData] = useState<IMedicineType | null>(null);
      const handleDelete = async () => {
        setIsEditing(false)
        setEditingData(null)
        const res = await deleteMedicineType(item._id);
        if(res.success){
          alert("Deleted Successfully")
          myRouter.refresh();
        }
        else{
          alert("Failed to delete")
        }
      }
      const handleEdit = () => {
        setEditingData(item);
        setIsEditing(true);
      };
      return(
        <div className="flex gap-2">
          <Button
        variant={"destructive"}
        size={"sm"}
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-700 text-white rounded-lg justify-center">
        <Trash2 className="h-4 w-4  " />
          
        </Button>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg">
              <FilePen className="h-4 w-4" />
            </Button>

            {isEditing && (
            <div className="modal">
              <EditMedicineTypeServer
                initialData={editingData} // Truyền dữ liệu của item vào form
                onSave={(updatedData : IMedicineTypeDoc) => {
                  setEditingData(updatedData) // Cập nhật lại dữ liệu trong bảng
                  setIsEditing(false) // Đóng modal sau khi lưu
                  myRouter.refresh(); // Refresh lại trang để cập nhật dữ liệu
                }}
              />
            </div>
          )}
        </div>
        
      )
  }
},
]
