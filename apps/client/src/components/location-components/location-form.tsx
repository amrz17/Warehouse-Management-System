import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { locationSchema, type LocationPayload } from "@/schemas/schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useLocation } from "@/hooks/use-location"

type Props = {
  mode: "create" | "edit"
  initialData?: LocationPayload | null
  locId?: string
  onSuccess?: () => void
}

export function LocationForm({
  mode,
  initialData,
  locId,
  onSuccess,
}: Props) {

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<LocationPayload>({
    resolver: zodResolver(locationSchema),
  })

  // Destructure necessary methods and state from the form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form

  // Use the custom hook for order operations
  const { createLocation, updateLocation, isLoading } = useLocation()

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


  const onSubmit = async (values: LocationPayload) => {
    try {
      if (mode === "create") {
        await createLocation(values)
        toast.success("New location created")
      } else {
        if (!locId) return
        await updateLocation(locId, values)
        toast.success("Location updated")
      }

      onSuccess?.()
      reset()
    } catch {
      toast.error("Failed to save location")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div>
        <Label>Code Location</Label>
        <Input
          {...register("bin_code")}
        //   disabled={mode === "edit"}
        />
        {/* {errors.id_item && (
          <p className="text-sm text-red-500">
            {errors.id_item.message}
          </p>
        )} */}
      </div>

      <div>
        <Label>Description</Label>
        <Input {...register("description")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {mode === "create" ? "Create location" : "Update location"}
      </Button>
    </form>
  )
}
