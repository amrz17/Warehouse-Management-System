import { cancelInboundApi, completeInboundApi, createInboundApi } from "@/api/inbound.api";
import type { InboundPayload } from "@/schemas/schema";
import { useState } from "react";

export function useInbound() {
    const [isLoading, setIsLoading] = useState(false);

    // Create Inbound Shipment
    const createInbound = async (payload: InboundPayload) => {
        setIsLoading(true);

        try {
            const res = await createInboundApi({
                ...payload
            })
            return res;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to create inbound shipment";
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }

    // Cancel Inbound Shipment 
    const cancelInbound = async (id: string) => {
        setIsLoading(true);

        try {
            await cancelInboundApi(id);
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to cancel inbound shipment";
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }

    // Complete Inbound Shipment
    const completeInbound = async (id: string) => {
        setIsLoading(true);

        try {
            await completeInboundApi(id);
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to complete inbound shipment";
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }


    return {
        createInbound,
        isLoading,
        cancelInbound,
        completeInbound
    };
}