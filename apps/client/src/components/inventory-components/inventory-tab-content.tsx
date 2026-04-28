// contents/InventoryTabContent.tsx
import { useEffect, useState } from "react"
import { FilterIcon, NotebookPenIcon, PlusCircle, SortAscIcon, Table, TrashIcon } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { ResponsiveDialogDrawer } from "@/components/drawer-form"
import { ConfirmDeleteDialog } from "@/components/dialog-delete"
import { createActionColumn } from "@/components/action-column"
import { baseInventoryColumns } from "@/layout/TableHeaderLayout"

import { toast } from "sonner"
import { fetchInventory } from "@/api/inventory.api"
import { useInventory } from "@/hooks/use-inventory"
import { InventoryForm } from "./inventory-form"
import type { InventoryPayload } from "@/schemas/schema"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { IconFileExport, IconPackage, IconPackageOff, IconPackages } from "@tabler/icons-react"

export default function InventoryTabContent() {
  const [data, setData] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryPayload | null>(null)
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
  const handleEdit = async (inv: InventoryPayload) => {
    await setMode("edit")
    await setSelectedItem(inv)
    await setOpen(true)
  }

  const columns = [
    ...baseInventoryColumns,
    createActionColumn<InventoryPayload>([
      {
        label: "Edit",
        icon: <NotebookPenIcon className="mr-2 h-4 w-4" />,
        onClick: (inv) => handleEdit(inv),
      },
      {
        label: "Delete",
        icon: <TrashIcon className="mr-2 h-4 w-4" />,
        destructive: true,
        onClick: (inv) => handleDelete(inv.id_inventory!),
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
      toast.success("Item deleted")
      loadDataInventory()
    } catch {
      toast.error("Failed to delete item")
    } finally {
      setOpenDelete(false)
      setDeleteId(null)
    }
  }

  useEffect(() => { loadDataInventory() }, [])

  return (
    <div className="flex flex-col gap-2 lg:gap-4">
      {/* <Card className="@container/card mx-4 lg:mt-4 flex lg:flex-row p-4"> */}
      <div className="mx-4 flex lg:flex-row">
            {/* <div className="lg:w-3/4">
                <CardHeader>
                  <CardDescription className="text-xl w-full lg:text-3xl font-extrabold">
                    Inventory 
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex-col items-start lg:gap-1.5 text-sm">
                      Easily manage and track every order from here
                </CardFooter>
            </div> */}
      <div className="flex justify-end">
        <ResponsiveDialogDrawer
          open={open}
          onOpenChange={setOpen}
          // trigger={
          //   <Button onClick={() => { setMode("create"); setSelectedItem(null); setOpen(true); }}
          //   className="item-center p-4 w-full">
          //     <PlusCircle className="lg:mr-2 h-4 w-full lg:w-4" /> Create New Inventory
          //   </Button>
          // }
          title={mode === "create" ? "Add Inventory" : "Edit Inventory"}
        >
          <InventoryForm 
            mode={mode} 
            initialData={selectedItem} 
            invId={selectedItem?.id_inventory}
            onSuccess={() => { loadDataInventory(); setOpen(false); }} 
          />
        </ResponsiveDialogDrawer>
      </div>
      </div>
      <div className="grid grid-cols-3 gap-4 lg:px-4 @xl/main:grid-cols-2">
        <Card className="@container/card">
          <CardHeader>
            <CardAction>
              <IconPackage />
            </CardAction>
            <CardDescription>Total Product</CardDescription>
            {/* <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"> */}
              {/* <ProductCountCard /> */}
            {/* </CardTitle> */}
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              Total stock keeping unit shows the numbers of unique product types in the warehouse
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card px-4">
          <CardHeader>
            <CardAction>
              <IconPackages />
            </CardAction>
            <CardDescription>Total Stock</CardDescription>
            {/* <StockCountCard /> */}
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              Total Stock shows the total quantity of all items
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card px-4">
          <CardHeader>
            <CardAction>
              <IconPackageOff />
            </CardAction>
            <CardDescription>Out Of Stock</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              Out of stock show the number of products with zero available quantity
            </div>
          </CardFooter>
        </Card>
      </div>
      {/* <div className="flex justify-end px-4">
        <Button onClick={() => { setMode("create"); setSelectedItem(null); setOpen(true); }}
          className="item-center p-4 w-full lg:w-fit">
          <PlusCircle className="h-4 w-full lg:w-4" /> Create New Inventory
        </Button>
      </div> */}

        <div className="flex flex-row w-full">
            <div className="flex-1 items-center justify-start gap-3 mx-4 hidden lg:flex">
              <Button 
                size="lg"
              >
                <Table />
                Table View
              </Button>
              <Button 
                size="lg"
              >
                <FilterIcon />
                Filter
              </Button>
              <Button 
                size="lg"
              >
                <SortAscIcon />
                Sort
              </Button>
              </div>
            <div className="flex flex-1 items-center justify-end gap-4 mx-4">
              <Button 
                className="hidden lg:flex"
                size="lg"
              >
                <IconFileExport />
                Export
              </Button>
              <Button onClick={() => { setMode("create"); setSelectedItem(null); setOpen(true); }}
                className="item-center p-4 w-full lg:w-fit">
                <PlusCircle className="h-4 w-full lg:w-4" /> Create New Inventory
              </Button>
            </div>
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