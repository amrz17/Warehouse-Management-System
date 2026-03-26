import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { OutboundSchema, OutboundStatusEnum, type OutboundPayload } from "@/schemas/schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useOutbound } from "@/hooks/use-outbound"
import { useDropdownOptions } from "./sale-form"

type Props = {
  mode: "create" | "edit"
  initialData?: OutboundPayload | null
  outboundId?: string
  onSuccess?: () => void
}

export function OutboundForm({
  mode,
  initialData,
  outboundId,
  onSuccess,
}: Props) {

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<OutboundPayload>({
    resolver: zodResolver(OutboundSchema),
    defaultValues: {
      outbound_number: "",
      id_so: "",
      id_customer: "",
      id_user: "",
      shipped_at: "",
      note: "",
      items: [
        {
          id_item: "",
          id_soi: "",
          qty_shipped: 1,
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
  const { createOutbound, cancelOutbound } = useOutbound()

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        ...initialData,
        shipped_at: initialData.shipped_at?.slice(0, 10),
      })
    }

    if (mode === "create") {
      reset()
    }
  }, [mode, initialData, reset])


  const onSubmit = async (values: OutboundPayload) => {
    try {
      if (mode === "create") {
        await createOutbound(values)
        toast.success("Outbound order created")
      } else {
        if (!outboundId) return
        await cancelOutbound(outboundId)
        toast.success("Outbound order cancelled")
      }

      onSuccess?.()
      reset()
    } catch (error: any) {
      toast.error(error.message || "Failed to save outbound order")
      console.log(error.message)
    }
  }

  const { products, customer, loading } = useDropdownOptions() 

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div>
        <Label className="mb-2">Outbound Number</Label>
        <Input
          {...register("outbound_number")}
          disabled={mode === "edit"}
        />
        {errors.outbound_number && (
          <p className="text-sm text-red-500">
            {errors.outbound_number.message}
          </p>
        )}
      </div>

      <div>
        <Label className="mb-2">Sale Order</Label>
        <Input {...register("id_so")} />
      </div>

      <div>
        <Label className="mb-2">Company Customer</Label>
        <select
          {...register("id_customer")}
          className="w-full bg-background border rounded-md px-3 py-2 text-sm"
          disabled={loading}
        >
          <option value="">
            {loading ? "Loading..." : "Pilih Customer"}
          </option>
          {customer.map((c: any) => (
            <option key={c.id_customer} value={c.id_customer}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.id_customer && (
          <p className="text-sm text-red-500">{errors.id_customer.message}</p>
        )}
      </div>

      <div>
        <Label className="mb-2">Created By</Label>
        <Input {...register("id_user")} />
      </div>

      <div>
        <Label className="mb-2">Shipped At</Label>
        <Input type="date" {...register("shipped_at")} />
      </div>

      <div>
        <Label className="mb-2">Carrier Name</Label>
        <Input {...register("carrier_name")} />
      </div>

      <div>
        <Label className="mb-2">Tracking Number</Label>
        <Input {...register("tracking_number")} />
      </div>

      <div>
        <Label className="mb-2">Status</Label>
        {/* <Input {...register("status_outbound")} /> */}
        <select 
          {...register("status_outbound")}
          className="w-full bg-background border rounded-md px-3 py-2 text-sm"
          >
          <option value="">
            {loading ? "Loading..." : "Pilih Status"}
          </option>
            {OutboundStatusEnum.options.map((status) => (
                <option key={status} value={status}>
                    {status}
                </option>
            ))}
        </select>
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
            <Label className="mb-2">Item</Label>
            {/* <Input {...register(`items.${index}.id_item` as const)} />
            {errors.items?.[index]?.id_item && (
              <p className="text-red-500 text-sm">{errors.items[index]?.id_item?.message}</p>
            )} */}
            <select
              {...register(`items.${index}.id_item` as const)}
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
            {errors.items?.[index]?.id_item && (
              <p className="text-sm text-red-500">{errors.items[index]?.id_item?.message}</p>
            )}
          </div>


          <div>
            <Label className="mb-2">SO Item</Label>
            <Input {...register(`items.${index}.id_soi` as const)} />
            {errors.items?.[index]?.id_soi && (
              <p className="text-red-500 text-sm">{errors.items[index]?.id_soi?.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-2">Quantity</Label>
            <Input 
              type="number"
              {...register(`items.${index}.qty_shipped` as const, { valueAsNumber: true })} 
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
                onClick={() => append({ id_item: "", qty_shipped: 1, id_soi: "" })}
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
