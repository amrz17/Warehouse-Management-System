"use client"

import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { saleOrderSchema, SaleStatusEnum, type SaleOrderPayload } from "@/schemas/schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useSaleOrders } from "@/hooks/use-sale-order"
import { fetchCust } from "@/api/customer.api"
import { fetchItems } from "@/api/item.api"
import { fetchSaleOrders } from "@/api/sale-order.api"

export const useDropdownOptions = () => {
    const [soNumber, setSONumber] = useState([]);
    const [products, setProducts] = useState([]);
    const [customer, SetCustomer] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [p, c, s] = await Promise.all([
                    fetchItems(),
                    fetchCust(),
                    fetchSaleOrders()
                ]);
                setProducts(p);
                SetCustomer(c);
                setSONumber(s);
            } catch (err) {
                console.error('Gagal fetch dropdown:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    return { products, customer, soNumber, loading };
};

type Props = {
  mode: "create" | "edit"
  initialData?: SaleOrderPayload | null
  orderId?: string
  onSuccess?: () => void
}

export function SaleForm({
  mode,
  initialData,
  orderId,
  onSuccess,
}: Props) {

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<SaleOrderPayload>({
    resolver: zodResolver(saleOrderSchema),
    defaultValues: {
      so_number: "",
      id_customer: "",
      date_shipped: "",
      so_status: "",
      note: "",
      items: [
        {
          id_item: "",
          qty_ordered: 1,
          qty_shipped: 0,
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
  const { createSaleOrder, cancelSaleOrder, isLoading } = useSaleOrders()

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        ...initialData,
        date_shipped: initialData.date_shipped?.slice(0, 10),
      })
    }

    if (mode === "create") {
      reset()
    }
  }, [mode, initialData, reset])


  const onSubmit = async (values: SaleOrderPayload) => {
    try {
      if (mode === "create") {
        await createSaleOrder(values)
        toast.success("Sale order created")
      } else {
        if (!orderId) return
        await cancelSaleOrder(orderId)
        toast.success("Sale order cancelled")
      }

      onSuccess?.()
      reset()
    } catch {
      toast.error("Failed to save sale order")
    }
  }

  
  const { products, customer, loading } = useDropdownOptions() // ← tambahkan

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div>
        <Label className="mb-2">Customer Name</Label>
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
              {c.customer_name}
            </option>
          ))}
        </select>
        {errors.id_customer && (
          <p className="text-sm text-red-500">{errors.id_customer.message}</p>
        )}
      </div>

      <div>
        <Label className="mb-2">Date Shipped</Label>
        <Input type="date" {...register("date_shipped")} />
      </div>

      <div>
        <Label className="mb-2">Status</Label>
        {/* <Input {...register("so_status")} /> */}
        <select 
          {...register("so_status")}
          className="w-full bg-background border rounded-md px-3 py-2 text-sm"
          >
        <option value="">Pilih Status</option>
            {SaleStatusEnum.options.map((status) => (
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
        <div key={field.id} className="grid grid-cols-2 gap-2 border p-4 rounded-lg mb-1">
          <div>
            <Label>Item Name</Label>
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
