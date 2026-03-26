"use client"

import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { orderSchema, PurchaseStatusEnum, type OrderPayload } from "@/schemas/schema"
import { useOrders } from "@/hooks/use-orders"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { fetchItems } from '@/api/item.api';
import { fetchSuppliers } from "@/api/supplier.api"

export const useDropdownOptions = () => {
    const [products, setProducts] = useState([]);
    const [supplier, SetSupplier] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [p, c] = await Promise.all([
                    fetchItems(),
                    fetchSuppliers(),
                ]);
                setProducts(p);
                SetSupplier(c);
            } catch (err) {
                console.error('Gagal fetch dropdown:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    return { products, supplier, loading };
};

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
  const { createOrder, cancelOrder } = useOrders()

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
        await cancelOrder(orderId)
        toast.success("Purchase order cancelled")
      }

      onSuccess?.()
      reset()
    } catch {
      toast.error("Failed to save purchase order")
    }
  }

  const { products, supplier, loading } = useDropdownOptions() // ← tambahkan

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div>
        <Label className="mb-2">Supplier Name</Label>
        <select
          {...register("id_supplier")}
          className="w-full bg-background border rounded-md px-3 py-2 text-sm"
          disabled={loading}
        >
          <option value="">
            {loading ? "Loading..." : "Pilih Supplier"}
          </option>
          {supplier.map((s: any) => (
            <option key={s.id_supplier} value={s.id_supplier}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.id_supplier && (
          <p className="text-sm text-red-500">{errors.id_supplier.message}</p>
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

      <div className="flex flex-col gap-1">
        <Label>Status</Label>
        {/* <Input {...register("po_status")} /> */}
        <select 
          {...register("po_status")}
          className="w-full bg-background border rounded-md px-3 py-2 text-sm"
          >
          <option value="">
            {loading ? "Loading..." : "Pilih Status"}
          </option>
            {PurchaseStatusEnum.options.map((status) => (
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
            <Label>Item Name</Label>
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
