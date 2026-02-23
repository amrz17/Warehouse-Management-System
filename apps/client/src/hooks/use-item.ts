import { createItemApi, deleteItemApi, updateItemApi } from "@/api/item.api";
import type { ItemPayload } from "@/schemas/schema";
import { useState } from "react";

export function useItems() {
    const [isLoading, setIsLoading] = useState(false)

    const createItem = async (payload: ItemPayload) => {
        setIsLoading(true)

        try {
            const res = await createItemApi({
                ...payload
            })
            return res
        } finally {
            setIsLoading(false)
        }
    }

    const updateItem = async (id: string, payload: ItemPayload) => {
        setIsLoading(true)
        console.log("idItem", id)

        try {
            const res = await updateItemApi(id, {
                sku: payload.sku,
                name: payload.name,
                description: payload.description,
                price: payload.price,
            })
            return res
        } finally {
            setIsLoading(false)
        }
    }

    // 
    const deleteItem = async (id: string) => {
        setIsLoading(true)
        try {
            await deleteItemApi(id)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        createItem,
        updateItem,
        deleteItem,
        isLoading
    }
}