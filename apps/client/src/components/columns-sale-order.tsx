import type { SaleOrderPayload } from "@/schemas/schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Ban, MoreHorizontal } from "lucide-react";
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "./ui/badge";

export const columnsSaleOrders = ( 
  onCancel: (id_so: string) => void
): ColumnDef<SaleOrderPayload>[] => [
    {
        accessorKey: "so_number",
        header: "No. Sale Order",
    },
    {
        accessorKey: "createdBy.full_name",
        header: "Created By",
    },
    {
        accessorKey: "customer.customer_name",
        header: "Customer Name",
    },
    {
        accessorKey: "id_item",
        header: "Item Name",
        cell: ({ row }) => {
        const items = row.original.items || [];
        console.log(items);
        const firstItem = items[0]?.item?.name;
        const extraItems = items.length - 1;

        return (
            <div className="flex items-center justify-center gap-1">
                <Badge variant="secondary" className="text-xs">
                    {firstItem || "No Items"}
                </Badge>
            {extraItems > 0 && (
                <Badge>
                    +{extraItems} more
                </Badge>
            )}
            </div>
        );
        },
    },
    {
        accessorKey: "so_status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.so_status;
            return <Badge variant={status === "COMPLETED" ? "default" : "secondary"}>{status}</Badge>;
        }
    },
    {
        accessorKey: "date_shipped",
        header: "Date Shipped",
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

        cell: ({ row }) => {
            const saleOrder = row.original;
            return (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onCancel(saleOrder.id_so!)}>
                        <Ban className="h-4 w-4 text-red-500"/>
                        Cancel Order
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
]