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
import { Badge } from "./ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PurchaseOrder = {
  id_po?: string,
  po_number?: string,
  id_supplier: string
  supplier: {
    name: string;
  };
  id_user: string
  createdBy: {
    name: string;
  };
  expected_delivery_date: string
  po_status: string
  note?: string
  items: {
    id_item: string
    qty_ordered: number
    qty_received?: number
    price_per_unit: number
    total_price?: number
    item?: {
      name: string
    }
  }[]
  last_update: string
  created_at: string
}

// Define the columns for the data table.
export const columnsOrders = ( 
  onEdit: (order: PurchaseOrder) => void,
  onDelete: (id_po: string) => void
): ColumnDef<PurchaseOrder>[] => [
  {
    accessorKey: "supplier.name",
    header: "Company Supplier",
  },
  {
    accessorKey: "createdBy.full_name",
    header: "Created By",
  },
  {
    accessorKey: "id_item",
    header: "Item IDs",
    cell: ({ row }) => {
      const items = row.original.items || [];
      const firstItem = items[0]?.item?.name;
      const extraItems = items.length - 1;

      return (
        <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs">
            {firstItem || "No Items"}
            </Badge>
          {extraItems > 0 && (
            <Badge variant="secondary" className="text-xs">
              +{extraItems} more
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "items.qty_ordered",
    header: "Quantity Ordered",
    cell: ({ row }) => {
      const items = row.original.items || [];
      // Mengambil semua qty_ordered dan menggabungkannya dengan koma
      return <span>{items.map(i => i.qty_ordered).join(", ")}</span>;
    },
  },
  {
    accessorKey: "items.qty_received",
    header: "Quantity Received",
    cell: ({ row }) => {
      const items = row.original.items || [];
      console.log("Items in row:", items);
      // Mengambil semua qty_ordered dan menggabungkannya dengan koma
      return <span>{items.map(i => i.qty_received).join(", ")}</span>;
    },
  },
  {
    accessorKey: "items.total_price",
    header: "Total Price",
    cell: ({ row }) => {
      const items = row.original.items || [];
      console.log("Items in row:", items);
      // Mengambil semua qty_ordered dan menggabungkannya dengan koma
      return <span>{items.map(i => i.total_price).join(", ")}</span>;
    },
  },
  {
    accessorKey: "expected_delivery_date",
    header: "Date PO",
  },
  {
    accessorKey: "po_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.po_status;
      return <Badge variant={status === "COMPLETED" ? "default" : "secondary"}>{status}</Badge>;
    }
  },
  {
    accessorKey: "last_updated",
    header: "Updated At",
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
              onClick={() => onDelete(purchaseOrder.id_po!)}
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