"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Ban, MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "./ui/badge"
import type { InboundPayload } from "@/schemas/schema"

// Define the columns for the data table.
export const columnsInbound = ( 
  onCancel: (id_inbound: string) => void
): ColumnDef<InboundPayload>[] => [
  {
    accessorKey: "inbound_number",
    header: "Inbound Number",
  },
  {
    accessorKey: "id_item",
    header: "Item Name",
    cell: ({ row }) => {
      const items = row.original.items || [];
      console.log("items",items)
      const firstItem = items[0]?.item?.name;
      const extraItems = items.length - 1;

      return (
        <div className="flex items-center gap-1">
          <p>
            {firstItem || "No Items"}
          </p>
          {extraItems > 0 && (
            <p>
              +{extraItems} more
            </p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "items.qty_received",
    header: "Quantity Received",
    cell: ({ row }) => {
      const items = row.original.items || [];
      // Mengambil semua qty_received dan menggabungkannya dengan koma
      return <span>{items.map(i => i.qty_received).join(", ")}</span>;
    },
  },
  {
    accessorKey: "received_at",
    header: "Received Date",
    cell: ({ getValue }) => {
    const value = getValue<string>()

    if (!value) return "-"

    return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    })
  },
  },
  {
    accessorKey: "status_inbound",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status_inbound;
      return <Badge variant={status === "RECEIVED" ? "default" : "secondary"}>{status}</Badge>;
    }
  },
  {
    accessorKey: "last_update",
    header: "Last Update",
    cell: ({ getValue }) => {
    const value = getValue<string>()

    if (!value) return "-"

    return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    })
  },
  },
  {
  id: "actions",
    // Define the actions column
    cell: ({ row }) => {
      const inbound = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onCancel(inbound.id_inbound!)}>
                <Ban className="h-4 w-4 text-red-500"/>
                Cancel Inbound
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]