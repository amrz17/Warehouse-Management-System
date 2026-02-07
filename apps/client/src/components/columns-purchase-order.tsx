"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Ban, MoreHorizontal, NotebookPenIcon, TrashIcon } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "./ui/badge"
import type { OrderPayload } from "@/schemas/schema"

// Define the columns for the data table.
export const columnsOrders = ( 
  onCancel: (id_po: string) => void
): ColumnDef<OrderPayload>[] => [
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
            <DropdownMenuItem onClick={() => onCancel(purchaseOrder.id_po!)}>
                <Ban className="h-4 w-4 text-red-500"/>
                Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]