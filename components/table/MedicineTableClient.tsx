"use client";

import React from "react";
import { getMedicineColumns } from "./medicineColumns"; // client function có hook
import DataTable from "./MedicineTable";

interface MedicineTableClientProps {
  data: any[]; // bạn có thể thay bằng type chính xác nếu có
  medicineTypes: { _id: string; name: string }[];
}

export default function MedicineTableClient({ data, medicineTypes }: MedicineTableClientProps) {
  // Khởi tạo columns trong client component
  const columns = getMedicineColumns(medicineTypes);

  return <DataTable columns={columns} data={data} />;
}
