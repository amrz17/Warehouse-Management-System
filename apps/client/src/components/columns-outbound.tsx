import type { ColumnDef } from "@tanstack/react-table"
import { Ban, Car, MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "./ui/badge"
import type { OutboundPayload } from "@/schemas/schema"
import { IconChecklist } from "@tabler/icons-react"

// Define the columns for the data table.
export const columnsOutbound = ( 
  onShipped: (id_outbound: string) => void,
  onComplete: (id_outbound: string) => void,
  onCancel: (id_outbound: string) => void
): ColumnDef<OutboundPayload>[] => [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => <div className="text-center text-muted-foreground">{row.index + 1}</div>,
  },
  {
    accessorKey: "outbound_number",
    header: "Outbound Number",
  },
  {
    accessorKey: "id_item",
    header: "Item Name",
    cell: ({ row }) => {
      const items = row.original.items || [];
      const firstItem = items[0]?.item?.name;
      const extraItems = items.length - 1;

      return (
        <div className="flex items-center justify-center gap-1">
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
    accessorKey: "items.qty_shipped",
    header: "Quantity Shipped",
    cell: ({ row }) => {
      const items = row.original.items || [];
      // Mengambil semua qty_shipped dan menggabungkannya dengan koma
      return <span>{items.map(i => i.qty_shipped).join(", ")}</span>;
    },
  },
  {
    accessorKey: "shipped_at",
    header: "Shipped At",
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
    accessorKey: "status_outbound",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status_outbound;
      return <Badge variant={status === "SHIPPED" ? "default" : "secondary"}>{status}</Badge>;
    }
  },
  {
    accessorKey: "updated_at",
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
      const outbound = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onShipped(outbound.id_outbound!)}>
                <Car className="h-4 w-4 text-blue-500"/>
                Shipped Outbound
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onComplete(outbound.id_outbound!)}>
                <IconChecklist className="h-4 w-4 text-green-500"/>
                Complete Outbound
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCancel(outbound.id_outbound!)}>
                <Ban className="h-4 w-4 text-red-500"/>
                Cancel Outbound
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]