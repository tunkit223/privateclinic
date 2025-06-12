"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
  updateMedicineBatchStatus,
  deleteMedicineBatch,
  increaseMedicineAmountFromBatchItems,
} from "@/lib/actions/medicineBatch.action";
import { IMedicineBatch } from "@/database/medicineBatch";
import { useRouter } from "next/navigation";
import { CheckCircle2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { DataTable } from "@/components/table/ImportTable";
import StatusBadge from "../StatusBadge";

interface Props {
  data: IMedicineBatch[];
  medicineTypes: { _id: string; name: string }[];
}

// 👇 Hàm tạo columns
export const columns = (
  medicineTypes: Props["medicineTypes"]
): ColumnDef<IMedicineBatch>[] => [
  {
    header: "STT",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "medicineName",
    header: "Tên thuốc",
    cell: ({ row }) => (
      <p className="text-14-medium">{(row.original as any).medicineName}</p>
    ),
  },
  {
    accessorKey: "medicineTypeName",
    header: "Loại thuốc",
    cell: ({ row }) => (
      <p className="text-14-medium">{(row.original as any).medicineTypeName}</p>
    ),
  },
  {
    accessorKey: "unit",
    header: "Đơn vị",
    cell: ({ row }) => (
      <p className="text-14-medium">{(row.original as any).unit}</p>
    ),
  },
  {
    accessorKey: "importDate",
    header: "Ngày nhập",
    cell: ({ row }) => (
      <p className="text-14-medium">
        {format(new Date(row.original.importDate), "dd/MM/yyyy")}
      </p>
    ),
    filterFn: (row, columnId, value: [string, string]) => {
      const rowDate = new Date(row.getValue(columnId));
      const [start, end] = value;
      if (start && rowDate < new Date(start)) return false;
      if (end && rowDate > new Date(end)) return false;
      return true;
    },
  },
  {
    accessorKey: "importQuantity",
    header: "Số lượng",
    cell: ({ row }) => (
      <p className="text-14-medium">{row.original.importQuantity}</p>
    ),
  },
  {
    accessorKey: "expiryDate",
    header: "Hạn dùng",
    cell: ({ row }) => (
      <p className="text-14-medium">
        {row.original.expiryDate
          ? format(new Date(row.original.expiryDate), "dd/MM/yyyy")
          : "-"}
      </p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={row.original.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "note",
    header: "Ghi chú",
    cell: ({ row }) => (
      <p className="text-14-medium max-w-[150px] truncate">
        {row.original.note || "-"}
      </p>
    ),
  },
  {
    accessorKey: "totalValue",
    header: "Tổng giá trị",
    cell: ({ row }) => (
      <p className="text-14-medium">
        {row.original.totalValue
          ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(row.original.totalValue)
          : "-"}
      </p>
    ),
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const router = useRouter();
      const batch = row.original;

      const handleConfirm = async () => {
        const res = await updateMedicineBatchStatus(batch._id, "imported");
        if (res.success) {
          const increaseRes = await increaseMedicineAmountFromBatchItems(batch._id.toString());

            if (increaseRes.success) {
              alert("✅ Đã xác nhận và nhập thuốc");
            } else {
              alert("⚠️ Nhập thuốc thất bại: " + increaseRes.message);
            }
          router.refresh();
        } else {
          alert("Cập nhật thất bại");
        }
      };

      const handleDelete = async () => {
        const res = await deleteMedicineBatch(batch._id);
        if (res.success) {
          alert("Đã đưa vào thùng rác");
          router.refresh();
        } else {
          alert("Xóa thất bại");
        }
      };

      return (
        <div className="flex gap-2">
          {batch.status === "importing" && (
            <Button
              onClick={handleConfirm}
              className="bg-green-500 hover:bg-green-700 text-white"
              size="sm"
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Xác nhận
            </Button>
          )}
          {batch.status === "importing" && (
            <Button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white"
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          )}
        </div>
      );
    },
  },
];

// ✅ Component chính để hiển thị bảng
const MedicineBatchTableClient = ({ data, medicineTypes }: Props) => {
  return <DataTable columns={columns(medicineTypes)} data={data} />;
};

export default MedicineBatchTableClient;
