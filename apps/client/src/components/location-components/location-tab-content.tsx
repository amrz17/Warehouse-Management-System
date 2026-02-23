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
import { fetchLocation } from "@/api/location.api"
import { useLocation } from "@/hooks/use-location"
import { LocationForm } from "./location-form"
import type { LocationPayload } from "@/schemas/schema"
import { Card, CardDescription, CardFooter, CardHeader } from "../ui/card"

export default function LocationTabContent() {
  const [data, setData] = useState<any>([])
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<LocationPayload | null>(null)
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
  const handleEdit = async (loc: LocationPayload) => {
    await setMode("edit")
    await setSelectedItem(loc)
    await setOpen(true)
  }

  const columns = [
    ...baseLocationColumns,
    createActionColumn<LocationPayload>([
      {
        label: "Edit",
        icon: <NotebookPenIcon className="mr-2 h-4 w-4" />,
        onClick: (loc) => handleEdit(loc),
      },
      {
        label: "Delete",
        icon: <TrashIcon className="mr-2 h-4 w-4" />,
        destructive: true,
        onClick: (loc) => handleDelete(loc.id_location!),
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
    <div className="flex flex-col lg:gap-4">
      <Card className="@container/card mx-4 lg:mt-4 flex lg:flex-row p-4">
            <div className="lg:w-3/4">
                <CardHeader>
                  <CardDescription className="text-xl w-full lg:text-3xl font-extrabold">
                    Location
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex-col items-start lg:gap-1.5 text-sm">
                      Easily manage and track every location here.
                </CardFooter>
            </div>
        <div className="flex justify-end">
          <ResponsiveDialogDrawer
            open={open}
            onOpenChange={setOpen}
            trigger={
              <Button 
                onClick={() => { setMode("create"); setSelectedItem(null); setOpen(true); }}
                size="lg"
                className="w-full"
                >
                <PlusCircle className="lg:mr-2 h-4 w-4" /> Create New Location
              </Button>
            }
            title={mode === "create" ? "Add Location" : "Edit Location"}
          >
            <LocationForm 
              mode={mode} 
              initialData={selectedItem} 
              locId={selectedItem?.id_location}
              onSuccess={() => { loadDataLocation(); setOpen(false); }} 
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