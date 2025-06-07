"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IUser } from "@/database/user.model"
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";

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
]
