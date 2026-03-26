import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { inventorySchema, type InventoryPayload } from "@/schemas/schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useInventory } from "@/hooks/use-inventory"
import { useDropdownOptions } from "@/hooks/use-dropdown"

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
  const { products, warehouses, loading } = useDropdownOptions() // ← tambahkan

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
        console.log("id", invId)
        await updateInventory(invId, values)
        toast.success("Inventory updated")
        console.log("Edit sudah dilakukan")
      }

      onSuccess?.()
      reset()
    } catch {
      toast.error("Failed to save inventory")
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit, (errors) => console.log("Validation Errors:", errors))} className="grid gap-4">
      {/* Dropdown Produk */}
      <div className="flex flex-col gap-2">
        <Label>Item</Label>
        <select
          {...register("id_item")}
          className="w-full bg-background border rounded-md px-3 py-2 text-sm"
          disabled={loading}
        >
          <option value="">
            {loading ? "Loading..." : "Pilih Item"}
          </option>
          {products.map((p: any) => (
            <option key={p.id_item} value={p.id_item}>
              {p.name}
            </option>
          ))}
        </select>
        {errors.id_item && (
          <p className="text-sm text-red-500">{errors.id_item.message}</p>
        )}
      </div>

      {/* Dropdown Gudang */}
      <div className="flex flex-col gap-2">
        <Label>Lokasi Gudang</Label>
        <select
          {...register("id_location")}
          className="w-full bg-background border rounded-md px-3 py-2 text-sm"
          disabled={loading}
        >
          <option value="">
            {loading ? "Loading..." : "Pilih Lokasi"}
          </option>
          {warehouses.map((w: any) => (
            <option key={w.id_location} value={w.id_location}>
              {w.bin_code}
            </option>
          ))}
        </select>
        {errors.id_location && (
          <p className="text-sm text-red-500">{errors.id_location.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Quantity Available</Label>
        <Input type="number" {...register("qty_available", { valueAsNumber: true })} />
        {errors.qty_available && (
          <p className="text-sm text-red-500">{errors.qty_available.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Quantity Ordered</Label>
        <Input type="number" {...register("qty_ordered", { valueAsNumber: true })} />
        {errors.qty_ordered && (
          <p className="text-sm text-red-500">{errors.qty_ordered.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Quantity Reserved</Label>
        <Input type="number" {...register("qty_reserved", { valueAsNumber: true })} />
        {errors.qty_reserved && (
          <p className="text-sm text-red-500">{errors.qty_reserved.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting || loading}>
        {mode === "create" ? "Create Inventory" : "Update Inventory"}
      </Button>
    </form>
  )
}
