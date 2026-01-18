import type { InventoryOrder } from "@/types/inventory.type"
import type { ItemsOrder } from "@/types/item.type"
import type { LocationOrder } from "@/types/location.type"
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

export const baseInventoryColumns: ColumnDef<InventoryOrder>[] = [
  {
    accessorKey: "id_item",
    header: "Item Name",
  },
  {
    accessorKey: "id_location",
    header: "Location",
  },
  {
    accessorKey: "qty_available",
    header: "Quantity",
  },
  {
    accessorKey: "qty_reserved",
    header: "Reserved",
  },
]

export const baseLocationColumns: ColumnDef<LocationOrder>[] = [
  {
    accessorKey: "bin_code",
    header: "Code Location"
  },
  {
    accessorKey: "description",
    header: "Description"
  },
  {
    accessorKey: "created_at",
    header: "Created At"
  },

]
