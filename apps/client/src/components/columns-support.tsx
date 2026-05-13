import type { ColumnDef } from "@tanstack/react-table";
import { supportService } from "@/services/support";
import type { SupportTicket } from "@/services/support";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { isAdmin } from "@/services/auth.service";
import { toast } from "sonner";

export const columnsSupport = (refresh: () => void): ColumnDef<SupportTicket>[] => [
  {
    accessorKey: "title",
    header: "Subject",
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const colors: Record<string, string> = {
        LOW: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        HIGH: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      };
      return <Badge className={colors[priority]}>{priority}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const colors: Record<string, string> = {
        OPEN: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        RESOLVED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        CLOSED: "bg-black text-white dark:bg-white dark:text-black",
      };
      return <Badge className={colors[status]}>{status.replace("_", " ")}</Badge>;
    },
  },
  {
    accessorKey: "user.full_name",
    header: "Submitted By",
    cell: ({ row }) => {
      const user = row.original.user;
      return user ? user.full_name : "Me";
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("created_at");
      if (!date) return "-";
      return new Date(date as string).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ticket = row.original;
      const admin = isAdmin();

      const handleUpdateStatus = async (status: string) => {
        try {
          await supportService.updateTicketStatus(ticket.id, status);
          toast.success("Status updated");
          refresh();
        } catch (error) {
          toast.error("Failed to update status");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(ticket.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {admin && (
              <>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Change Status</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleUpdateStatus("OPEN")}>
                  Set to Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus("IN_PROGRESS")}>
                  Set to In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus("RESOLVED")}>
                  Set to Resolved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus("CLOSED")}>
                  Set to Closed
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
