"use client"

import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { inboundSchema, InboundStatusEnum, type InboundPayload } from "@/schemas/schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useInbound } from "@/hooks/use-inbound"
import { useDropdownOptions } from "./order-form"
import { usePOItems } from "@/hooks/use-po-items"

type Props = {
  mode: "create" | "edit"
  initialData?: InboundPayload | null
  inboundId?: string
  onSuccess?: () => void
}


export function InboundForm({
  mode,
  initialData,
  inboundId,
  onSuccess,
}: Props) {

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<InboundPayload>({
    resolver: zodResolver(inboundSchema),
    defaultValues: {
      id_po: "",
      received_at: "",
      note: "",
      items: [
        {
          id_item: "",
          id_poi: "",
          qty_received: 1,
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
  const { createInbound, cancelInbound } = useInbound()

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        ...initialData,
        received_at: initialData.received_at?.slice(0, 10),
      })
    }

    if (mode === "create") {
      reset()
    }
  }, [mode, initialData, reset])


  const onSubmit = async (values: InboundPayload) => {
    try {
      if (mode === "create") {
        await createInbound(values)
        toast.success("Inbound order created")
      } else {
        if (!inboundId) return
        await cancelInbound(inboundId)
        toast.success("Inbound order cancelled")
      }

      onSuccess?.()
      reset()
    } catch (error: any) {
      toast.error(error.message || "Failed to save inbound order")
      console.log(error.message)
    }
  }


  const { products, supplier, poNumber, loading } = useDropdownOptions() 
  const [selectedPO, setSelectedPO] = useState('');
  const { poItems, loadingItems } = usePOItems(selectedPO); 


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      {/* <div>
        <Label className="mb-2">Inbound Number</Label>
        <Input
          {...register("inbound_number")}
          disabled={mode === "edit"}
          placeholder="IB - Tanggal - No Urut"
        />
        {errors.inbound_number && (
          <p className="text-sm text-red-500">
            {errors.inbound_number.message}
          </p>
        )}
      </div> */}

      <div>
        <Label className="mb-2">PO Number</Label>
        <select
          {...register("id_po")}
          className="w-full bg-background border rounded-md px-3 py-2 text-sm"
          value={selectedPO}
                    onChange={(e) => {
                        setSelectedPO(e.target.value);
                        // Reset item yang dipilih saat PO berubah
                    }}
          disabled={loading}
        >
          <option value="">
            {loading ? "Loading..." : "Pilih PO Number"}
          </option>
          {poNumber.map((po: any) => (
            <option key={po.id_po} value={po.id_po}>
              {po.po_number}
            </option>
          ))}
        </select>
        {errors.id_po && (
          <p className="text-sm text-red-500">{errors.id_po.message}</p>
        )}
      </div>

      <div>
        <Label className="mb-2">Received At</Label>
        <Input type="date" {...register("received_at")} />
      </div> 

      <div>
        <Label className="mb-2">Status</Label>
        {/* <Input {...register("status_inbound")} /> */}
        <select 
          {...register("status_inbound")}
          className="w-full bg-background border rounded-md px-3 py-2 text-sm"
          >
          <option value="">
            {loading ? "Loading..." : "Pilih Status"}
          </option>
            {InboundStatusEnum.options.map((status) => (
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
          {/* <div>
            <Label className="mb-2">PO Item</Label>
            <Input {...register(`items.${index}.id_poi` as const)} />
            {errors.items?.[index]?.id_poi && (
              <p className="text-red-500 text-sm">{errors.items[index]?.id_poi?.message}</p>
            )}
          </div> */}

          <div>
                <label>PO Item</label>
                <select 
                  {...register(`items.${index}.id_poi`)}
                  disabled={!selectedPO || loadingItems}
                  className="w-full bg-background border rounded-md px-3 py-2 text-sm"
                >
                    <option value="">
                        {!selectedPO
                            ? 'Pilih PO dulu'
                            : loadingItems
                            ? 'Loading...'
                            : 'Pilih Item'}
                    </option>
                    {poItems.map((item: any) => (
                        <option key={item.id_poi} value={item.id_poi}>
                            {item.poi_number}
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
              {...register(`items.${index}.qty_received` as const, { valueAsNumber: true })} 
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
                onClick={() => append({ id_item: "", qty_received: 1, id_poi: "" })}
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
