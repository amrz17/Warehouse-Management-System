import { createInventoryApi, deleteInventoryApi, updateInventoryApi } from "@/api/inventory.api";
import type { InventoryPayload } from "@/schemas/schema";
import { useState } from "react";

export function useInventory() {
    const [isLoading, setIsLoading] = useState(false)

    const createInventory = async (payload: InventoryPayload ) => {
        setIsLoading(true)

        try {
            const res = await createInventoryApi({
                ...payload
            })
            return res
        } finally {
            setIsLoading(false)
        }
    }

    const updateInventory = async (id: string, payload: InventoryPayload) => {
        setIsLoading(true)

        try {
            const res = await updateInventoryApi(id, {
                ...payload
            })
            return res
        } finally {
            setIsLoading(false)
        }
    }

    const deleteInventory = async (id:string) => {
        setIsLoading(true)

        try {
            await deleteInventoryApi(id)
        } finally {
            setIsLoading(false)
        }
    }

    return { 
        createInventory,
        updateInventory,
        deleteInventory,
        isLoading
    }
}