"use client"

import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { orderSchema, type OrderPayload } from "@/schemas/schema"
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
      po_number: "",
      id_supplier: "",
      id_user: "",
      expected_delivery_date: "",
      po_status: "",
      note: "",
      items: [
        {
          id_item: "",
          qty_ordered: 1,
          price_per_unit: 0,
        }
      ],
    },
  })

  // Destructure necessary methods and state from the form
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = form

  const { fields, append, remove } = useFieldArray({
    control, // Hubungkan dengan control di atas
    name: "items", // Nama ini harus sama dengan yang ada di Zod schema & defaultValues
  });

  // Use the custom hook for order operations
  const { createOrder, updateOrder, isLoading } = useOrders()

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        ...initialData,
        expected_delivery_date: initialData.expected_delivery_date?.slice(0, 10),
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
        <Label className="mb-2">Supplier Name</Label>
        <Input
          {...register("id_supplier")}
          disabled={mode === "edit"}
        />
        {errors.id_supplier && (
          <p className="text-sm text-red-500">
            {errors.id_supplier.message}
          </p>
        )}
      </div>

      <div>
        <Label className="mb-2">Created By</Label>
        <Input {...register("id_user")} />
      </div>

      <div>
        <Label className="mb-2">Expected Delivery Date</Label>
        <Input type="date" {...register("expected_delivery_date")} />
      </div>

      <div>
        <Label className="mb-2">Status</Label>
        <Input {...register("po_status")} />
      </div>

      <div>
        <Label className="mb-2">Note</Label>
        <Input {...register("note")} />
      </div>

      <div>
        <Label>Item Detail</Label>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-3 gap-2 border p-4 rounded-lg mb-1">
          <div>
            <Label>Item Name</Label>
            <Input {...register(`items.${index}.id_item` as const)} />
            {errors.items?.[index]?.id_item && (
              <p className="text-red-500 text-sm">{errors.items[index]?.id_item?.message}</p>
            )}
          </div>

          <div>
            <Label>Quantity</Label>
            <Input 
              type="number"
              {...register(`items.${index}.qty_ordered` as const, { valueAsNumber: true })} 
            />
          </div>

          <div>
            <Label>Price</Label>
            <Input 
              type="number"
              {...register(`items.${index}.price_per_unit` as const, { valueAsNumber: true })} 
            />
          </div>
          
          <div className="col-span-3 flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => remove(index)}
              disabled={fields.length === 1} // Mencegah form kosong tanpa item
            >
                Remove
            </Button>

            {index === fields.length - 1 && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => append({ id_item: "", qty_ordered: 1, price_per_unit: 0 })}
              >
                Add
              </Button>
            )}
        </div>
        </div>
      ))}


      <Button type="submit" disabled={isSubmitting}>
        {mode === "create" ? "Submit" : "Submit Changes"}
      </Button>
    </form>
  )
}
