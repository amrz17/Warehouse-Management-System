import type { ItemsOrder } from "@/types/item.type"
import type { ColumnDef } from "@tanstack/react-table"

export const baseItemColumns: ColumnDef<ItemsOrder>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "name",
    header: "Item Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => {
        const value = getValue<number>()
        return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        }).format(value)
    },
  },
  // {
  //   accessorKey: "isActive",
  //   header: "Is Active",
  // },
  {
    accessorKey: "created_at",
    header: "Created At",
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
]
