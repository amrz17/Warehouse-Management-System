"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { InventoryPayload } from "@/schemas/schema"

export const columnsStockReport: ColumnDef<InventoryPayload>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row, table }) => {
      // Calculate row number across pagination
      const index = row.index;
      return <div className="text-center text-muted-foreground">{index + 1}</div>;
    },
  },
  {
    accessorKey: "item.name",
    header: "Item Name",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.item?.name ?? "-"}</div>;
    }
  },
  {
    accessorKey: "location.bin_code",
    header: "Location",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-300/20">
            {row.original.location?.bin_code ?? "-"}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "qty_available",
    header: "Qty Available",
    cell: ({ row }) => {
      const qty = row.original.qty_available ?? 0;
      const minS = row.original.min_stock ?? 0;
      let color = "text-green-600";
      if (qty <= 0) color = "text-red-600";
      else if (minS > 0 && qty <= minS) color = "text-amber-600";
      else if (qty < 10) color = "text-amber-600";
      return <div className="text-center"><span className={`font-semibold ${color}`}>{qty}</span></div>;
    }
  },
  {
    accessorKey: "min_stock",
    header: "Min Stock",
    cell: ({ row }) => <div className="text-center text-sm">{row.original.min_stock ?? 0}</div>
  },
  {
    accessorKey: "max_stock",
    header: "Max Stock",
    cell: ({ row }) => <div className="text-center text-sm">{row.original.max_stock ?? 0}</div>
  },
  {
    accessorKey: "qty_ordered",
    header: "Qty Ordered",
    cell: ({ row }) => <div className="text-center">{row.original.qty_ordered ?? 0}</div>
  },
  {
    accessorKey: "qty_reserved",
    header: "Qty Reserved",
    cell: ({ row }) => <div className="text-center">{row.original.qty_reserved ?? 0}</div>
  },
  {
    accessorKey: "last_update",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = row.original.last_update;
      return (
        <div className="text-center text-sm text-muted-foreground">
          {date
            ? new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-"}
        </div>
      );
    }
  },
]

export const columnsLowStockReport: ColumnDef<InventoryPayload>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => <div className="text-center text-muted-foreground">{row.index + 1}</div>,
  },
  {
    accessorKey: "item.name",
    header: "Item Name",
    cell: ({ row }) => <div className="font-medium">{row.original.item?.name ?? "-"}</div>,
  },
  {
    accessorKey: "location.bin_code",
    header: "Location",
    cell: ({ row }) => (
      <div className="text-center">
        <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-300/20">
          {row.original.location?.bin_code ?? "-"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "qty_available",
    header: "Qty Available",
    cell: ({ row }) => {
      const qty = row.original.qty_available ?? 0;
      return (
        <div className="text-center">
          <span className={`font-bold text-lg ${qty <= 0 ? "text-red-600" : "text-amber-600"}`}>
            {qty}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "min_stock",
    header: "Min Stock",
    cell: ({ row }) => {
      const minS = row.original.min_stock ?? 0;
      return <div className="text-center text-sm">{minS > 0 ? minS : "-"}</div>;
    }
  },
  {
    id: "severity",
    header: "Severity",
    cell: ({ row }) => {
      const qty = row.original.qty_available ?? 0;
      const minS = row.original.min_stock ?? 0;
      const DEFAULT_THRESHOLD = 10;
      const getSeverity = (qty: number, minS: number) => {
        if (qty <= 0) return { label: "Out of Stock", color: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 ring-red-600/20 dark:ring-red-400/30" };
        const threshold = minS > 0 ? minS : DEFAULT_THRESHOLD;
        if (qty <= threshold * 0.5) return { label: "Critical", color: "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 ring-orange-600/20 dark:ring-orange-400/30" };
        return { label: "Low", color: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 ring-amber-600/20 dark:ring-amber-400/30" };
      };
      const severity = getSeverity(qty, minS);
      
      return (
        <div className="text-center">
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${severity.color}`}>
            {severity.label}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "last_update",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = row.original.last_update;
      return (
        <div className="text-center text-sm text-muted-foreground">
          {date
            ? new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-"}
        </div>
      );
    }
  },
]
