import { cancelOutboundApi, completeOutboundApi, createOutboundApi, shipOutboundApi } from "@/api/outbound.api";
import type { OutboundPayload, ShipOutboundPayload } from "@/schemas/schema";
import { useState } from "react";

export function useOutbound() {
    const [isLoading, setIsLoading] = useState(false);
    
    // Create Outbound Shipment
    const createOutbound = async (payload: OutboundPayload) => {
        setIsLoading(true);
        try {
           const res = await createOutboundApi({
               ...payload
           });
           return res; 
        } catch (error: any) {
            console.log('Error response:', error.response?.data); // ← tambahkan ini
           const message = error.response?.data?.message || "Failed to create outbound shipment";
           throw new Error(message); 
        } finally {
            setIsLoading(false);
        }
    }

    // Ship Outbound Shipment
    const shipOutbound = async (id: string, payload: ShipOutboundPayload) => {
        setIsLoading(true);
        try {
            const res = await shipOutboundApi(id, payload);
            return res;
        } catch (error: any) {
            console.log('Error response:', error.response?.data); 
            const message = error.response?.data?.message || "Failed to ship outbound shipment";
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }

    // 
    const completeOutbound = async (id: string) => {
        setIsLoading(true);
        try {
            await completeOutboundApi(id);
        } catch (error: any) {
            console.log('Error response:', error.response?.data);
            const message = error.response?.data?.message || "Failed to complete outbound";
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }

    // Cancel Outbound Shipment
    const cancelOutbound = async (id: string) => {
        setIsLoading(true);

        try {
            await cancelOutboundApi(id);
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to cancel outbound shipment";
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        createOutbound,
        isLoading,
        cancelOutbound,
        shipOutbound,
        completeOutbound
    }
}