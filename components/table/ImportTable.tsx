"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import Image from "next/image"
import { Input } from "../ui/input"
import { useState } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [nameFilter, setNameFilter] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // Cập nhật filter cho tên
  const handleNameFilter = (value: string) => {
    setNameFilter(value)
    table.getColumn("medicineName")?.setFilterValue(value)
  }

  // Cập nhật filter cho ngày
  const handleDateFilter = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
    table.getColumn("importDate")?.setFilterValue([start, end])
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4 w-full max-w-[1200px]">
        <Input
          placeholder="Tìm theo tên thuốc..."
          value={nameFilter}
          onChange={(e) => handleNameFilter(e.target.value)}
          className="mb-2 md:mb-0 md:w-1/2 border border-gray-300"
        />
        <div className="flex gap-2 items-center md:w-1/2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => handleDateFilter(e.target.value, endDate)}
            className="border border-gray-300"
          />
          <span>—</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => handleDateFilter(startDate, e.target.value)}
            className="border border-gray-300"
          />
        </div>
      </div>

      <div className="data-table">
        <Table className="shad-table">
          <TableHeader className="bg-blue-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="shad-table-row-header">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="shad-table-row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="table-actions flex justify-center mt-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="shad-gray-btn"
          >
            <Image src="/assets/icons/arrow.svg" width={24} height={24} alt="arrow" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="shad-gray-btn"
          >
            <Image
              src="/assets/icons/arrow.svg"
              width={24}
              height={24}
              alt="arrow"
              className="rotate-180"
            />
          </Button>
        </div>
      </div>
    </>
  )
}

export default DataTable
