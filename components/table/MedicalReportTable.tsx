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
import { useEffect, useState } from "react"
import { format } from "date-fns"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const [filterType, setFilterType] = useState<"today" | "all" | "custom">("today")
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), "yyyy-MM-dd"))

  useEffect(() => {
    const column = table.getColumn("schedule")
    if (!column) return

    if (filterType === "all") {
      column.setFilterValue(undefined)
    } else if (filterType === "today") {
      column.setFilterValue(format(new Date(), "yyyy-MM-dd"))
    } else if (filterType === "custom") {
      column.setFilterValue(selectedDate)
    }
  }, [filterType, selectedDate])

  return (
    <>
      
      <div className="w-full flex justify-between items-center mb-4 flex-wrap gap-3 mt-12">
        <div className="w-full flex justify-end ">
        <Input
          placeholder="Search by patient's name..."
          value={(table.getColumn("patient")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("patient")?.setFilterValue(event.target.value)
          }
          className="w-full mr-5  text-dark-200 py-5 border border-dark-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
        />

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border px-3 py-2 rounded-md text-sm bg-blue-300"
          >
            <option value="today">Today</option>
            <option value="all">All</option>
            <option value="custom">Choose date</option>
          </select>

          {filterType === "custom" && (
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border p-2 rounded-md text-sm bg-blue-300"
            />
          )}
        </div>
      </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="data-table">
        <Table className="shad-table">
          <TableHeader className="bg-blue-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="shad-table-row-header">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="shad-table-row">
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="table-actions mt-4 flex justify-center gap-3">
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
