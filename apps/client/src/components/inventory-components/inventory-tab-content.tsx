// contents/InventoryTabContent.tsx
import { useEffect, useState } from "react"
import { NotebookPenIcon, PlusCircle, TrashIcon } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { ResponsiveDialogDrawer } from "@/components/drawer-form"
import { ConfirmDeleteDialog } from "@/components/dialog-delete"
import { createActionColumn } from "@/components/action-column"
import { baseInventoryColumns } from "@/layout/TableHeaderLayout"

import { toast } from "sonner"
import { fetchInventory } from "@/api/inventory.api"
import { useInventory } from "@/hooks/use-inventory"
import type { InventoryOrder } from "@/types/inventory.type"
import { InventoryForm } from "./inventory-form"

export default function InventoryTabContent() {
  const [data, setData] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryOrder | null>(null)
  const [mode, setMode] = useState<"create" | "edit">("create")
  
  const { deleteInventory } = useInventory() 
  const [openDelete, setOpenDelete] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadDataInventory = async () => {  

    const items = await fetchInventory()
    setData(items)
  }

  // ... (handleEdit, handleDelete, confirmDelete logic sama seperti kode Anda)
  // Handle Edit item
  const handleEdit = async (inv: InventoryOrder) => {
    await setMode("edit")
    await setSelectedItem(inv)
    await setOpen(true)
  }

  const columns = [
    ...baseInventoryColumns,
    createActionColumn<InventoryOrder>([
      {
        label: "Edit",
        icon: <NotebookPenIcon className="mr-2 h-4 w-4" />,
        onClick: (inv) => handleEdit(inv),
      },
      {
        label: "Delete",
        icon: <TrashIcon className="mr-2 h-4 w-4" />,
        destructive: true,
        onClick: (inv) => handleDelete(inv.id_inventory),
      },
    ]),
  ]

  const handleDelete = async (id: string) => {
    await setDeleteId(id)
    await setOpenDelete(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      await deleteInventory(deleteId)
      toast.success("Item delted")
    //   loadDataItem()
    } catch {
      toast.error("Failed to delete item")
    } finally {
      setOpenDelete(false)
      setDeleteId(null)
    }
  }

  useEffect(() => { loadDataInventory() }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ResponsiveDialogDrawer
          open={open}
          onOpenChange={setOpen}
          trigger={
            <Button onClick={() => { setMode("create"); setSelectedItem(null); setOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Inventory
            </Button>
          }
          title={mode === "create" ? "Add Inventory" : "Edit Inventory"}
        >
          <InventoryForm 
            mode={mode} 
            initialData={selectedItem} 
            onSuccess={() => { loadDataInventory(); setOpen(false); }} 
          />
        </ResponsiveDialogDrawer>
      </div>

      <DataTable columns={columns} data={data} />

      <ConfirmDeleteDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={confirmDelete}
      />
    </div>
  )
}