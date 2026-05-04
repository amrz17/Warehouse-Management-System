import DashboarLayout from "@/layout/DashboardLayout"
import { DataTable } from "@/components/data-table"
import { ResponsiveDialogDrawer } from "@/components/drawer-form"
import { Button } from "@/components/ui/button"
import type { InboundPayload } from "@/schemas/schema"
import { PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { fetchInbound } from "@/api/inbound.api"
import { columnsInbound } from "@/components/columns-inbound"
import { InboundForm } from "@/components/inbound-form"
import { useInbound } from "@/hooks/use-inbound"
import { Card, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/dialog-confirm"

const Inbound = () => {

  const [data, setData] = useState<InboundPayload[]>([])
  const [open, setOpen] = useState(false)
  const [selectedInbound, setSelectedInbound] = useState<InboundPayload | null>(null)
  const [mode, setMode] = useState<"create" | "edit">("create")
  const { cancelInbound, completeInbound } = useInbound()

  const [openCancel, setOpenCancel] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [openComplete, setOpenComplete] = useState(false)
  const [completeId, setCompleteId] = useState<string | null>(null)

  const handleComplete = (id: string) => {
    setCompleteId(id)
    setOpenComplete(true)
  }

  const confirmComplete = async () => {
    if (!completeId) return

    try {
      await completeInbound(completeId)
      toast.success("Inbound completed successfully")
      loadInbounds()
    } catch (error) {
      toast.error("Failed to complete inbound")
    } finally {
      setOpenComplete(false)
      setCompleteId(null)
    }
  }

  const handleCancel = (id: string) => {
    setDeleteId(id)
    setOpenCancel(true)
  }

  const confirmCancel = async () => {
    if (!deleteId) return

    try {
      await cancelInbound(deleteId)
      toast.success("Inbound cancelled successfully")
      loadInbounds()
    } catch (error) {
      toast.error("Failed to cancel inbound")
    } finally {
      setOpenCancel(false)
      setDeleteId(null)
    }
  }

  // Load All Inbound
  const loadInbounds = async () => {
    const inbounds = await fetchInbound()
    console.log("Fetched Inbounds:", inbounds)
    setData(inbounds)
  }

  // Initial Load
  useEffect(() => {
    loadInbounds()
  }, [])

  return (
    <DashboarLayout>
        <section className="flex flex-1 flex-col mt-4">
          <Card className="@container/card mx-4 lg:mt-4 flex lg:flex-row p-4">
            <div className="lg:w-3/4 lg:mx-4">
                <CardHeader>
                  <CardDescription className="text-xl w-full lg:text-3xl font-extrabold">
                    Inbound
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      Create your inbound order by adding supplier information, selecting products, and setting quantities. Easily manage and track every inbound from here.
                </CardFooter>
            </div>
        <div className="flex lg:w-1/4 items-center lg:mx-4 justify-end">
            <ResponsiveDialogDrawer
            open={open}
            onOpenChange={setOpen}
            trigger={
                <Button 
                className="mx-auto w-full lg:ml-4"
                onClick={() => {
                    setMode("create")
                    setSelectedInbound(null)
                    setOpen(true)
                }}
                >
                <PlusCircle />
                Create New Inbound
                </Button>
            }
            title={
                mode === "create"
                ? "Create New Inbound"
                : "Edit Inbound"
            }
            // description={
            //   mode === "create"
            //     ? "This form is to create a new inbound."
            //     : "Update the selected inbound."
            // }
            >
            <InboundForm
                mode={mode}
                initialData={selectedInbound}
                inboundId={selectedInbound ? selectedInbound.id_inbound : undefined}
                onSuccess={() => {
                loadInbounds()
                setOpen(false)
                }}
            />

            </ResponsiveDialogDrawer>
        </div>
          </Card>

        <div className="w-full flex-col justify-start gap-6"> 
            <DataTable 
              columns={columnsInbound(handleComplete, handleCancel)} 
              data={data} 
            />
            <ConfirmDialog 
              open={openCancel}
              onOpenChange={setOpenCancel}
              onConfirm={confirmCancel}
              title="Cancel Inbound Order"
              description="This action cannot be undone. This will permanently cancel the order."
              confirmLabel="Yes, Cancel Order"
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500" 
            />
            <ConfirmDialog 
              open={openComplete}
              onOpenChange={setOpenComplete}
              onConfirm={confirmComplete}
              title="Complete Inbound Order"
              description="This action cannot be undone. This will permanently complete the order."
              confirmLabel="Yes, Complete Order"
              className="bg-green-600 hover:bg-green-700 focus:ring-green-500" 
            />
        </div>
        </section>
    </DashboarLayout>
  )
}

export default Inbound