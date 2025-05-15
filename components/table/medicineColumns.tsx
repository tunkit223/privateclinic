"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IMedicine } from "@/database/medicine"
import { getMedicineTypeNameById } from "@/lib/actions/medicineType.action";
import { useState, useEffect } from 'react';


export const columns: ColumnDef<IMedicine>[] = [
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
    accessorKey: "medicineTypeId",
    header: "Type",
    accessorFn: (row) => {
      return  row.name;
    },
    cell: ({ row }) => {
      const [medicineTypeName, setMedicineTypeName] = useState("Loading...");
  
      useEffect(() => {
        const fetchMedicineTypeName = async () => {
          const name = await getMedicineTypeNameById(row.original.medicineTypeId);
          setMedicineTypeName(name);
        };
  
        fetchMedicineTypeName();
      }, [row.original.medicineTypeId]);
  
      return <p className="text-14-medium">{medicineTypeName}</p>;
    },
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({row}) =>{
      return(
      <div className="text-14-regular min-w-[100px]">
        {row.original.unit}
      </div>)
    }
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell:({row}) =>(
      <p className="text-14-regular min-w-[100px]">
        {row.original.amount}
      </p>
    )
  },
  {
    accessorKey: "price",
    header: "Price",
    cell:({row}) =>(
      <p className="text-14-regular min-w-[100px]">
        {row.original.price}
      </p>
    )
  },
  
]
