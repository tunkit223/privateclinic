"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IPatient } from "@/database/patient.model"
import { formatDateTime } from "@/lib/utils";


export const columns: ColumnDef<IPatient>[] = [
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
    accessorKey: "email",
    header: "Email",
    cell: ({row}) =>{
      return(
      <div className="text-14-regular min-w-[100px]">
        {row.original.email}
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
    accessorKey: "gender",
    header: "Gender",
    cell:({row}) =>(
      <p className="text-14-regular min-w-[100px]">
        {row.original.gender}
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
  {
      accessorKey: "birthdate",
      header: "Birthdate",
      cell:({row}) =>(
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(row.original.birthdate).dateTime}
        </p>
      )
    },
  
]
