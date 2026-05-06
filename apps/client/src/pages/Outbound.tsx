import { fetchOutbound } from '@/api/outbound.api'
import { columnsOutbound } from '@/components/columns-outbound'
import { DataTable } from '@/components/data-table'
import { ConfirmDialog } from '@/components/dialog-confirm'
import { ShipDialog } from '@/components/dialog-shipped'
import { ResponsiveDialogDrawer } from '@/components/drawer-form'
import { OutboundForm } from '@/components/outbound-fom'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { useOutbound } from '@/hooks/use-outbound'
import DashboardLayout from '@/layout/DashboardLayout'
import type { OutboundPayload, ShipOutboundPayload } from '@/schemas/schema'
import { PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Outbound = () => {
  const [data, setData] = useState<OutboundPayload[]>([])
  const [open, setOpen] = useState(false)
  const [selectedOutbound, setSelectedOutbound] = useState<OutboundPayload | null>(null)
  const [mode, setMode] = useState<"create" | "edit">("create")
  const { cancelOutbound, shipOutbound, completeOutbound } = useOutbound()

  const [openCancel, setOpenCancel] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [shipOpen, setShipOpen] = useState(false);
  const [shipId, setShipId] = useState<string | null>(null)

  const [completeOpen, setCompleteOpen] = useState(false);
  const [completeId, setCompleteId] = useState<string | null>(null);

  const handleShip = (id: string) => {
    setShipId(id);
    setShipOpen(true);
  };

  // Tambahkan dto sebagai parameter
  const confirmShip = async (dto: ShipOutboundPayload) => {
    if (!shipId) return; 

    try {
        await shipOutbound(shipId, dto); // ← kirim shipId dan dto
        toast.success("Outbound shipped successfully");
        loadOutbounds();
    } catch (error) {
        toast.error("Failed to ship outbound");
    } finally {
        setShipOpen(false);
        setShipId(null); // ← reset shipId bukan deleteId
    }
  };


  const handleComplete = (id: string) => {
      setCompleteId(id);
      setCompleteOpen(true);
  };

  const confirmComplete = async () => {
      if (!completeId) return;
      try {
          await completeOutbound(completeId);
          toast.success("Outbound completed successfully");
          loadOutbounds();
      } catch (error) {
          toast.error("Failed to complete outbound");
      } finally {
          setCompleteOpen(false);
          setCompleteId(null);
      }
  };

  const handleCancel = (id: string) => {
    setDeleteId(id)
    setOpenCancel(true)
  }

  const confirmCancel = async () => {
    if (!deleteId) return

    try {
      await cancelOutbound(deleteId)
      toast.success("Outbound cancelled successfully")
      loadOutbounds()
    } catch (error) {
      toast.error("Failed to cancel outbound")
    } finally {
      setOpenCancel(false)
      setDeleteId(null)
    }
  }

  // Load All Outbound
  const loadOutbounds = async () => {
    const outbounds = await fetchOutbound()
    console.log("Fetched Outbounds:", outbounds)
    setData(outbounds)
  }

  // Initial Load
  useEffect(() => {
    loadOutbounds()
  }, [])

  return (
    <DashboardLayout>
        <section className="flex flex-1 flex-col mt-4">
        <Card className="@container/card mt-4 mx-4 lg:mt-4 flex lg:flex-row p-4">
          <div className="lg:w-3/4">
                <CardHeader>
                  <CardDescription className="text-xl w-full lg:text-3xl font-extrabold">
                    Outbound
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      Create your outbound order by adding customer information, selecting products, and setting quantities.
                </CardFooter>
            </div>
          <div className="flex lg:w-1/4 items-center justify-end">
              <ResponsiveDialogDrawer
              open={open}
              onOpenChange={setOpen}
              trigger={
                  <Button
                  className="w-full lg:ml-4"
                  onClick={() => {
                      setMode("create")
                      setSelectedOutbound(null)
                      setOpen(true)
                  }}
                  >
                  <PlusCircle />
                  Create New Outbound
                  </Button>
              }
              title={
                  mode === "create"
                  ? "Create New Outbound"
                  : "Edit Outbound"
              }
              description={
                mode === "create"
                  ? "This form is to create a new outbound."
                  : "Update the selected outbound."
              }
              >
              <OutboundForm
                  mode={mode}
                  initialData={selectedOutbound}
                  outboundId={selectedOutbound ? selectedOutbound.id_outbound : undefined}
                  onSuccess={() => {
                  loadOutbounds()
                  setOpen(false)
                  }}
              />

              </ResponsiveDialogDrawer>

          </div>
        </Card>
        <div className="w-full flex-col justify-start gap-6"> 
            <DataTable 
              columns={columnsOutbound(handleShip, handleComplete, handleCancel)} 
              data={data} 
            />
            <ShipDialog
                open={shipOpen}
                onOpenChange={setShipOpen}
                onConfirm={confirmShip}
                outboundNumber={selectedOutbound?.outbound_number}
            />
            <ConfirmDialog 
              open={completeOpen}
              onOpenChange={setCompleteOpen}
              onConfirm={confirmComplete}
              title="Complete Outbound Order"
              description="This action cannot be undone. This will permanently complete the order."
              confirmLabel="Yes, Complete Order"
              className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            />
            <ConfirmDialog 
              open={openCancel}
              onOpenChange={setOpenCancel}
              onConfirm={confirmCancel}
              title="Cancel Outbound Order"
              description="This action cannot be undone. This will permanently cancel the order."
              confirmLabel="Yes, Cancel Order"
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            />
        </div>
        </section>
    </DashboardLayout>
  )
}

export default Outbound