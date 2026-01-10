"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { orderSchema, type OrderPayload } from "@/schemas/order.schema"
import { useOrders } from "@/hooks/use-orders"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type Props = {
  mode: "create" | "edit"
  initialData?: OrderPayload | null
  orderId?: string
  onSuccess?: () => void
}

export function OrderForm({
  mode,
  initialData,
  orderId,
  onSuccess,
}: Props) {

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<OrderPayload>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      po_code: "",
      id_user: "",
      date_po: "",
      po_status: "",
      note: "",
    },
  })

  // Destructure necessary methods and state from the form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form

  // Use the custom hook for order operations
  const { createOrder, updateOrder, isLoading } = useOrders()

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        ...initialData,
        date_po: initialData.date_po?.slice(0, 10),
      })
    }

    if (mode === "create") {
      reset()
    }
  }, [mode, initialData, reset])


  const onSubmit = async (values: OrderPayload) => {
    try {
      if (mode === "create") {
        await createOrder(values)
        toast.success("Purchase order created")
      } else {
        if (!orderId) return
        await updateOrder(orderId, values)
        toast.success("Purchase order updated")
      }

      onSuccess?.()
      reset()
    } catch {
      toast.error("Failed to save purchase order")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div>
        <Label>PO Code</Label>
        <Input
          {...register("po_code")}
          disabled={mode === "edit"}
        />
        {errors.po_code && (
          <p className="text-sm text-red-500">
            {errors.po_code.message}
          </p>
        )}
      </div>

      <div>
        <Label>Company</Label>
        <Input {...register("id_user")} />
      </div>

      <div>
        <Label>Date PO</Label>
        <Input type="date" {...register("date_po")} />
      </div>

      <div>
        <Label>Status</Label>
        <Input {...register("po_status")} />
      </div>

      <div>
        <Label>Note</Label>
        <Input {...register("note")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {mode === "create" ? "Create Order" : "Update Order"}
      </Button>
    </form>
  )
}
