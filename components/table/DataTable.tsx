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
import CreateAppointmentModal from "../CreateAppointmentModal"
import StatCard from "../StatCard"
import { getAppointmentStatsByDate } from "@/lib/actions/appointment.action"

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
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return format(today, "yyyy-MM-dd")
  })

  useEffect(() => {
    const column = table.getColumn("schedule")
    if (!column) return

    if (filterType === "all") {
      column.setFilterValue(undefined)
    } else if (filterType === "today") {
      const today = format(new Date(), "yyyy-MM-dd")
      column.setFilterValue(today)
    } else if (filterType === "custom") {
      column.setFilterValue(selectedDate)
    }
  }, [filterType, selectedDate])
  const [appointments, setAppointments] = useState({
  confirmedCount: 0,
  pendingCount: 0,
  cancelledCount: 0,
})

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getAppointmentStatsByDate(filterType, selectedDate)
      setAppointments(stats)
    }
    fetchStats()
  }, [filterType, selectedDate])
  return (
    <>
      <section className='admin-stat'>
          <StatCard
            type="appointments"
            count={appointments.confirmedCount}
            label="Confirmed appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>
        {/* Bộ lọc nằm bên phải */}
        <div className="w-full flex justify-end">
          <Input
          placeholder="Search by patient's name..."
          value={(table.getColumn("patient")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("patient")?.setFilterValue(event.target.value)
          }
          className="w-full text-dark-200 p-5 border border-dark-200 rounded-lg mr-5 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        <CreateAppointmentModal/>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border px-3 ml-5 py-2 rounded-md text-sm bg-blue-300"
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
              className="border p-5 rounded-md text-sm max-w-[150px] ml-2 bg-blue-300"
            />
          )}
        </div>


      <div className="data-table">
        <Table className="shad-table">
          <TableHeader className="bg-blue-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="shad-table-row-header">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="table-actions mt-4 flex justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="shad-gray-btn"
          >
            <Image
              src="/assets/icons/arrow.svg"
              width={24}
              height={24}
              alt="arrow"
            />
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