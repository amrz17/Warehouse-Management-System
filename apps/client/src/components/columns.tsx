"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, NotebookPenIcon, TrashIcon } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PurchaseOrder = {
  id_po: string
  po_code: string
  id_user: string
  date_po: string
  po_status: string
  note?: string
  update_at: string
  created_at: string
}

// Define the columns for the data table.
export const columnsOrders = ( 
  onEdit: (order: PurchaseOrder) => void,
  onDelete: (id_po: string) => void
): ColumnDef<PurchaseOrder>[] => [
  {
    accessorKey: "po_code",
    header: "PO Code",
  },
  {
    accessorKey: "id_user",
    header: "Company",
  },
  {
    accessorKey: "date_po",
    header: "Date PO",
  },
  {
    accessorKey: "po_status",
    header: "Status",
  },
  {
    accessorKey: "update_at",
    header: "Updated At",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
  {
  id: "actions",
    // Define the actions column
    cell: ({ row }) => {
      const purchaseOrder = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onEdit(purchaseOrder)}
            >
              <NotebookPenIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(purchaseOrder.id_po)}
            >
              <TrashIcon className="mr-2 h-4 w-4 text-red-500" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]