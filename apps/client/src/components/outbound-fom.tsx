import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { OutboundSchema, OutboundStatusEnum, type OutboundPayload } from "@/schemas/schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useOutbound } from "@/hooks/use-outbound"
import { useDropdownOptions } from "./sale-form"
import { useSOItems } from "@/hooks/use-so-items"

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

  const { products, customer, soNumber, loading } = useDropdownOptions() 
  const [selectedSO, setSelectedSO] = useState('');
  const { soItems, loadingItems } = useSOItems(selectedSO); 

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      {/* <div>
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
      </div> */}

      <div>
        <Label className="mb-2">Sale Order</Label>
        <select
          {...register("id_so")}
          className="w-full bg-background border rounded-md px-3 py-2 text-sm"
          value={selectedSO}
          onChange={(e) => {
              setSelectedSO(e.target.value);
              // Reset item yang dipilih saat PO berubah
          }}
          disabled={loading}
        >
          <option value="">
            {loading ? "Loading..." : "Pilih Sale Order"}
          </option>
          {soNumber.map((so: any) => (
            <option key={so.id_so} value={so.id_so}>
              {so.so_number}
            </option>
          ))}
        </select>
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
            <Label className="mb-2">SO Item</Label>
            <select 
              {...register(`items.${index}.id_soi`)}
              disabled={!selectedSO || loadingItems}
              className="w-full bg-background border text-white rounded-md px-3 py-2 text-sm"
            >
                <option value="">
                    {!selectedSO
                        ? 'Pilih PO dulu'
                        : loadingItems
                        ? 'Loading...'
                        : 'Pilih Item'}
                </option>
                {soItems.map((item: any) => (
                    <option key={item.id_soi} value={item.id_soi}>
                        {item.soi_number}
                    </option>
                ))}
            </select>
          </div>

          <div>
            <Label className="mb-2">Item</Label>
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
