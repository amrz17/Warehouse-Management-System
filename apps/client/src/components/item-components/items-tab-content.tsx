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
import { toast } from "sonner"
import type { ItemPayload } from "@/schemas/schema"
import { Card, CardDescription, CardFooter, CardHeader } from "../ui/card"

export default function ItemsTabContent() {
  const [data, setData] = useState<any>([])
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ItemPayload | null>(null)
  const [mode, setMode] = useState<"create" | "edit">("create")
  
  const { deleteItem } = useItems()
  const [openDelete, setOpenDelete] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadDataItem = async () => {
    const items = await fetchItems()
    setData(items)
  }

  const handleEdit = async (item: ItemPayload) => {
    await setMode("edit")
    await setSelectedItem(item)
    await setOpen(true)
  }

  const columns = [
    ...baseItemColumns,
    createActionColumn<ItemPayload>([
      {
        label: "Edit",
        icon: <NotebookPenIcon className="mr-2 h-4 w-4" />,
        onClick: (item) => handleEdit(item),
      },
      {
        label: "Delete",
        icon: <TrashIcon className="mr-2 h-4 w-4" />,
        destructive: true,
        onClick: (item) => handleDelete(item.id_item!),
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
    <div className="flex flex-col lg:gap-4">
      <Card className="@container/card mx-4 lg:mt-4 flex lg:flex-row p-4">
        <div className="lg:w-3/4">
            <CardHeader>
              <CardDescription className="text-xl w-full lg:text-3xl font-extrabold">
                Items
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex-col items-start lg:gap-1.5 text-sm">
                  Easily manage and track every items here.
            </CardFooter>
        </div>
        <div className="flex lg:justify-end">
          <ResponsiveDialogDrawer
            open={open}
            onOpenChange={setOpen}
            trigger={
              <Button 
                onClick={() => { setMode("create"); setSelectedItem(null); setOpen(true); }}
                className="w-full"
                size="lg"
              >
                <PlusCircle className="lg:mr-2 h-4 w-4" /> Create New Item
              </Button>
            }
            title={mode === "create" ? "Add Item" : "Edit Item"}
          >
            <ItemForm 
              mode={mode} 
              initialData={selectedItem} 
              itemId={selectedItem?.id_item}
              onSuccess={() => { loadDataItem(); setOpen(false); }} 
            />
          </ResponsiveDialogDrawer>
        </div>
      </Card>

      <DataTable columns={columns} data={data} />

      <ConfirmDeleteDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={confirmDelete}
      />
    </div>
  )
}