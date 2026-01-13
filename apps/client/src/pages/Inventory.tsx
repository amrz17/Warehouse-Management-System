// import { DataTable } from "@/components/data-table"
// import data from "./data.json"

import { fetchItems } from "@/api/item.api"
import { DataTable } from "@/components/data-table"
import DahsboardLayout from "@/layout/DashboardLayout"
import { useEffect, useState } from "react"


import { NotebookPenIcon, PlusCircle, TrashIcon } from "lucide-react"
import { baseItemColumns } from "@/layout/HeaderLayout"
import { createActionColumn } from "@/components/action-column"
import type { ItemsOrder } from "@/types/item.type"
import { ResponsiveDialogDrawer } from "@/components/drawer-form"
import { Button } from "@/components/ui/button"
import { ItemForm } from "@/components/item-form"
import { useItems } from "@/hooks/use-item"
import { toast } from "sonner"
import { ConfirmDeleteDialog } from "@/components/dialog-delete"

export default function Inventory() {
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

  // Handle Edit item
  const handleEdit = async (item: ItemsOrder) => {
    await setMode("edit")
    await setSelectedItem(item)
    await setOpen(true)
  }

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

  // Initial Load
  useEffect(() => {
    loadDataItem()
  }, [])

  return (
    <DahsboardLayout>
        <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">

            {/* <div className="flex w-1/4 items-center justify-end"> */}
            {/* </div> */}
            <div className="flex flex-col md:gap-6 md:py-6 justify-end">
              <ResponsiveDialogDrawer
                open={open}
                onOpenChange={setOpen}
                trigger={
                  <Button 
                    className="w-fit ml-4"
                    onClick={() => {
                      setMode("create")
                      setSelectedItem(null)
                      setOpen(true)
                    }}
                  >
                    <PlusCircle />
                    Create New Item
                  </Button>
                }
                title={
                  mode === "create"
                    ? "Create New Item"
                    : "Edit Item Information"
                }
                description={
                  mode === "create"
                    ? "This form is to create a new item."
                    : "Update the selected item."
                }
              >
                <ItemForm
                  mode={mode}
                  itemId={selectedItem ? selectedItem.id_item : undefined}
                  initialData={selectedItem}
                  onSuccess={() => {
                    loadDataItem()
                    setOpen(false)
                  }}
                />

              </ResponsiveDialogDrawer>
                <DataTable columns={columns} data={data} />
              <ConfirmDeleteDialog
                open={openDelete}
                onOpenChange={setOpenDelete}
                onConfirm={confirmDelete}
              />
            </div>
        </div>
        </div>
    </DahsboardLayout>
  )
}