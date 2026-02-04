// contents/InventoryTabContent.tsx
import { useEffect, useState } from "react"
import { NotebookPenIcon, PlusCircle, TrashIcon } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { ResponsiveDialogDrawer } from "@/components/drawer-form"
import { ConfirmDeleteDialog } from "@/components/dialog-delete"
import { createActionColumn } from "@/components/action-column"
import { baseLocationColumns } from "@/layout/TableHeaderLayout"

import { toast } from "sonner"
import type { LocationOrder } from "@/types/location.type"
import { fetchLocation } from "@/api/location.api"
import { useLocation } from "@/hooks/use-location"
import { LocationForm } from "./location-form"

export default function LocationTabContent() {
  const [data, setData] = useState<any>([])
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<LocationOrder | null>(null)
  const [mode, setMode] = useState<"create" | "edit">("create")
  
  const { deleteLocation } = useLocation()
  const [openDelete, setOpenDelete] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadDataLocation = async () => {  

    const items = await fetchLocation()
    setData(items)
  }

  // ... (handleEdit, handleDelete, confirmDelete logic sama seperti kode Anda)
  // Handle Edit item
  const handleEdit = async (loc: LocationOrder) => {
    await setMode("edit")
    await setSelectedItem(loc)
    await setOpen(true)
  }

  const columns = [
    ...baseLocationColumns,
    createActionColumn<LocationOrder>([
      {
        label: "Edit",
        icon: <NotebookPenIcon className="mr-2 h-4 w-4" />,
        onClick: (loc) => handleEdit(loc),
      },
      {
        label: "Delete",
        icon: <TrashIcon className="mr-2 h-4 w-4" />,
        destructive: true,
        onClick: (loc) => handleDelete(loc.id_location),
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
      await deleteLocation(deleteId)
      toast.success("Location deleted")
    //   loadDataItem()
    } catch {
      toast.error("Failed to delete location")
    } finally {
      setOpenDelete(false)
      setDeleteId(null)
    }
  }

  useEffect(() => { loadDataLocation() }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ResponsiveDialogDrawer
          open={open}
          onOpenChange={setOpen}
          trigger={
            <Button onClick={() => { setMode("create"); setSelectedItem(null); setOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Location
            </Button>
          }
          title={mode === "create" ? "Add Location" : "Edit Location"}
        >
          <LocationForm 
            mode={mode} 
            initialData={selectedItem} 
            onSuccess={() => { loadDataLocation(); setOpen(false); }} 
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