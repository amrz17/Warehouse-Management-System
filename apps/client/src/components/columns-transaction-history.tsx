"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react"

export interface UnifiedTransaction {
  id: string;
  number: string;
  type: "Inbound" | "Outbound";
  reference: string;
  handler: string;
  status: string;
  date: string;
  note: string;
  itemCount: number;
}

const statusColor: Record<string, string> = {
  RECEIVED:
    "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 ring-green-600/20 dark:ring-green-300/20",
  COMPLETED:
    "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 ring-green-600/20 dark:ring-green-300/20",
  PARTIAL:
    "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 ring-amber-600/20 dark:ring-amber-300/20",
  OPEN: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 ring-blue-600/20 dark:ring-blue-300/20",
  PICKING:
    "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ring-indigo-600/20 dark:ring-indigo-300/20",
  SHIPPED:
    "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 ring-purple-600/20 dark:ring-purple-300/20",
  CANCELED:
    "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 ring-red-600/20 dark:ring-red-300/20",
};

export const columnsTransactionHistory: ColumnDef<UnifiedTransaction>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => <div className="text-center text-muted-foreground">{row.index + 1}</div>,
  },
  {
    accessorKey: "number",
    header: "Transaction No.",
    cell: ({ row }) => <div className="font-medium font-mono text-sm">{row.original.number}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div className="text-center">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              type === "Inbound"
                ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                : "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300"
            }`}
          >
            {type === "Inbound" ? (
              <IconArrowDown className="size-3" />
            ) : (
              <IconArrowUp className="size-3" />
            )}
            {type}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => <div className="text-sm">{row.original.reference}</div>,
  },
  {
    accessorKey: "handler",
    header: "Handled By",
    cell: ({ row }) => <div className="text-sm">{row.original.handler}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="text-center">
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
              statusColor[status] ??
              "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 ring-gray-600/20"
            }`}
          >
            {status}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "itemCount",
    header: "Items",
    cell: ({ row }) => <div className="text-center">{row.original.itemCount}</div>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.date;
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
