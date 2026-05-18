import type { ActivityLogsPayload } from "@/schemas/schema";
import type { ColumnDef } from "@tanstack/react-table";

export const columnsActivityLogs = ( 
): ColumnDef<ActivityLogsPayload>[] => [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => <div className="text-center text-muted-foreground">{row.index + 1}</div>,
    },
    {
        accessorKey: "createdBy.full_name",
        header: "Created By",
    },
    {
        accessorKey: "action",
        header: "Action",
    },
    {
        accessorKey: "module",
        header: "Module",
    },
    // {
    //     accessorKey: "resource_id",
    //     header: "ID ",
    // },
    {
        accessorKey: "description",
        header: "Description",
    },
    // {
    //     accessorKey: "metadata",
    //     header: "Metadata",
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