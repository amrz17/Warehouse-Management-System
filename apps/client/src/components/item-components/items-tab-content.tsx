import { useEffect, useState } from "react"
import { NotebookPenIcon, PlusCircle, TrashIcon } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { ResponsiveDialogDrawer } from "@/components/drawer-form"
import { ItemForm } from "@/components/item-components/item-form"
import { ConfirmDeleteDialog } from "@/components/dialog-delete"
import { createActionColumn } from "@/components/action-column"
import { baseItemColumns } from "@/layout/TableHeaderLayout"
import { fetchItems } from "@/api/item.api"
import { useItems } from "@/hooks/use-item"
import type { ItemsOrder } from "@/types/item.type"
import { toast } from "sonner"

export default function ItemsTabContent() {
  const [data, setData] = useState<any>([])
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ItemsOrder | null>(null)
  const [mode, setMode] = useState<"create" | "edit">("create")
  
  const { deleteItem } = useItems()
  const [openDelete, setOpenDelete] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadDataItem = async () => {
    const items = await fetchItems()
    setData(items)
  }

  const handleEdit = async (item: ItemsOrder) => {
    await setMode("edit")
    await setSelectedItem(item)
    await setOpen(true)
  }

  const columns = [
    ...baseItemColumns,
    createActionColumn<ItemsOrder>([
      {
        label: "Edit",
        icon: <NotebookPenIcon className="mr-2 h-4 w-4" />,
        onClick: (item) => handleEdit(item),
      },
      {
        label: "Delete",
        icon: <TrashIcon className="mr-2 h-4 w-4" />,
        destructive: true,
        onClick: (item) => handleDelete(item.id_item),
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
      await deleteItem(deleteId)
      toast.success("Item delted")
      loadDataItem()
    } catch {
      toast.error("Failed to delete item")
    } finally {
      setOpenDelete(false)
      setDeleteId(null)
    }
  }

  useEffect(() => { loadDataItem() }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ResponsiveDialogDrawer
          open={open}
          onOpenChange={setOpen}
          trigger={
            <Button onClick={() => { setMode("create"); setSelectedItem(null); setOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Item
            </Button>
          }
          title={mode === "create" ? "Add Item" : "Edit Item"}
        >
          <ItemForm 
            mode={mode} 
            initialData={selectedItem} 
            onSuccess={() => { loadDataItem(); setOpen(false); }} 
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