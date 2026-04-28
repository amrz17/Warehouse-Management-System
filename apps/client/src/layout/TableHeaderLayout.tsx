import { Badge } from "@/components/ui/badge"
import type { InventoryPayload, ItemPayload, LocationPayload } from "@/schemas/schema"
import type { ColumnDef } from "@tanstack/react-table"

export const baseItemColumns: ColumnDef<ItemPayload>[] = [
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
    header: "Created at",
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

export const baseInventoryColumns: ColumnDef<InventoryPayload>[] = [
  {
    accessorKey: "id_item",
    header: "Item Name",
    cell: ({ row }) => {
      const items = row.original || [];
      const firstitem = items.item?.name;
      // const extraitems = items.length - 1;

      return (
        <div className="justify-center">
            {firstitem || "no items"}
          {/* {extraitems > 0 && (
            <p>
              +{extraitems} more
            </p>
          )} */}
        </div>
      );
    },
  },
  {
    accessorKey: "qty_available",
    header: "Quantity",
  },
  {
    accessorKey: "qty_reserved",
    header: "Reserved",
  },
  {
    accessorKey: "id_location",
    header: "Location",
    cell: ({ row }) => {
      const items = row.original || [];
      console.log("item",items.location?.bin_code)
      const firstitem = items.location?.bin_code;
      // const extraitems = items.length - 1;

      return (
        <div className="justify-center">
          <Badge>
            {firstitem || "no items"}
          </Badge>
          {/* {extraitems > 0 && (
            <Badge>
              +{extraitems} more
            </Badge>
          )} */}
        </div>
      );
    },
  },
]

export const baseLocationColumns: ColumnDef<LocationPayload>[] = [
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
