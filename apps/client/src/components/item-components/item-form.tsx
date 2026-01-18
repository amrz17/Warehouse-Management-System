"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { itemSchema, type ItemPayload } from "@/schemas/schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useItems } from "@/hooks/use-item"

type Props = {
  mode: "create" | "edit"
  initialData?: ItemPayload | null
  itemId?: string
  onSuccess?: () => void
}

export function ItemForm({
  mode,
  initialData,
  itemId,
  onSuccess,
}: Props) {

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<ItemPayload>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      sku: "",
      name: "",
      price: 0
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
  const { createItem, updateItem, isLoading } = useItems()

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


  const onSubmit = async (values: ItemPayload) => {
    try {
      if (mode === "create") {
        await createItem(values)
        toast.success("New item created")
      } else {
        if (!itemId) return
        await updateItem(itemId, values)
        toast.success("Item updated")
      }

      onSuccess?.()
      reset()
    } catch {
      toast.error("Failed to save item")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div>
        <Label>SKU</Label>
        <Input
          {...register("sku")}
          disabled={mode === "edit"}
        />
        {errors.sku && (
          <p className="text-sm text-red-500">
            {errors.sku.message}
          </p>
        )}
      </div>

      <div>
        <Label>Item Name</Label>
        <Input {...register("name")} />
      </div>

      <div>
        <Label>Price Item</Label>
        <Input type="number" {...register("price", { valueAsNumber: true })} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {mode === "create" ? "Create item" : "Update item"}
      </Button>
    </form>
  )
}
