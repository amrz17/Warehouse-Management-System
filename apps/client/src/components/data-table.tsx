"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel, // Tambahkan ini
  useReactTable,
} from "@tanstack/react-table"

import type { 
  ColumnDef, 
  SortingState, 
  ColumnFiltersState // Tambahkan ini
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableTabsList,   // Import komponen baru
  TableTabTrigger, // Import komponen baru
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  // 1. Tambahkan state untuk filter kolom
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [activeTab, setActiveTab] = React.useState("all")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // 2. Tambahkan pengatur filter
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters, // Daftarkan state filter di sini
    },
  })

  // 3. Fungsi untuk menangani perubahan tab
  // const handleTabChange = (status: string) => {
  //   setActiveTab(status)
  //   if (status === "all") {
  //     // Reset filter untuk kolom 'status'
  //     table.getColumn("status")?.setFilterValue("")
  //   } else {
  //     // Set filter kolom 'status' sesuai nilai tab
  //     table.getColumn("status")?.setFilterValue(status)
  //   }
  // }

  return (
    <div className="p-4 space-y-4">
      {/* 4. Implementasi Tabs UI */}
      {/* <TableTabsList>
        <TableTabTrigger 
          isActive={activeTab === "all"} 
          onClick={() => handleTabChange("all")}
        >
          Inventory
        </TableTabTrigger>
        <TableTabTrigger 
          isActive={activeTab === "active"} 
          onClick={() => handleTabChange("active")}
        >
          Items
        </TableTabTrigger>
        <TableTabTrigger 
          isActive={activeTab === "archived"} 
          onClick={() => handleTabChange("archived")}
        >
          Locations
        </TableTabTrigger>
      </TableTabsList> */}

      <div className="overflow-hidden rounded-md border text-center">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  No results found for "{activeTab}".
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}