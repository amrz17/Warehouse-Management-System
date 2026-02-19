import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { inventorySchema, type InventoryPayload } from "@/schemas/schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useInventory } from "@/hooks/use-inventory"

type Props = {
  mode: "create" | "edit"
  initialData?: InventoryPayload | null
  invId?: string
  onSuccess?: () => void
}

export function InventoryForm({
  mode,
  initialData,
  invId,
  onSuccess,
}: Props) {

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<InventoryPayload>({
    resolver: zodResolver(inventorySchema),
  })

  // Destructure necessary methods and state from the form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form

  // Use the custom hook for order operations
  const { createInventory, updateInventory, isLoading } = useInventory()

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        ...initialData,
      })
    }

    if (mode === "create") {
      reset()
    }
  }, [mode, initialData, reset])


  const onSubmit = async (values: InventoryPayload) => {
    console.log("Data yang akan dikirim:", values); // Apakah ini muncul saat klik submit?
    try {
      if (mode === "create") {
        await createInventory(values)
        toast.success("New inventory created")
      } else {
        if (!invId) return
        await updateInventory(invId, values)
        toast.success("Inventory updated")
      }

      onSuccess?.()
      reset()
    } catch {
      toast.error("Failed to save inventory")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div>
        <Label>ID Item</Label>
        <Input
          {...register("id_item")}
        //   disabled={mode === "edit"}
        />
        {/* {errors.id_item && (
          <p className="text-sm text-red-500">
            {errors.id_item.message}
          </p>
        )} */}
      </div>

      <div>
        <Label>ID Location</Label>
        <Input {...register("id_location")} />
      </div>

      <div>
        <Label>Quantity Available</Label>
        <Input type="number" {...register("qty_available", { valueAsNumber: true })} />
      </div>

      <div>
        <Label>Quantity Ordered</Label>
        <Input type="number" {...register("qty_ordered", { valueAsNumber: true })} />
      </div>

      <div>
        <Label>Quantity Reserved</Label>
        <Input type="number" {...register("qty_reserved", { valueAsNumber: true })} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {mode === "create" ? "Create inventory" : "Update inventory"}
      </Button>
    </form>
  )
}
