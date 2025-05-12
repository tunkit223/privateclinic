"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IMedicineType } from "@/database/medicineType"


export const columns: ColumnDef<IMedicineType>[] = [
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
  
]
