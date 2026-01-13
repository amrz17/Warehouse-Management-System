import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ColumnDef } from "@tanstack/react-table"

type RowAction<T> = {
  label: string
  icon?: React.ReactNode
  onClick: (row: T) => void
  destructive?: boolean
}

export function createActionColumn<T>(
  actions: RowAction<T>[]
): ColumnDef<T> {
  return {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {actions.map((action, i) => (
              <DropdownMenuItem
                key={i}
                onClick={() => action.onClick(data)}
                className={action.destructive ? "text-red-500" : ""}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
}
