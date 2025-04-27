"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IUser } from "@/database/user.model"
import { formatDateTime } from "@/lib/utils";


export const columns: ColumnDef<IUser>[] = [
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
    accessorKey: "image",
    header: "Image",
    cell:({row}) =>(
      <p className="text-14-regular min-w-[100px]">
        {row.original.image}
      </p>
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
]
