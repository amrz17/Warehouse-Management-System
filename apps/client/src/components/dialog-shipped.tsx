import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { ShipOutboundPayload } from "@/schemas/schema";

// components/dialog-ship.tsx
interface ShipDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (data: ShipOutboundPayload) => void;
    outboundNumber?: string;
}

export function ShipDialog({ open, onOpenChange, onConfirm, outboundNumber }: ShipDialogProps) {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [shippingProvider, setShippingProvider] = useState('');

    const handleConfirm = () => {
        onConfirm({ tracking_number: trackingNumber, carrier_name: shippingProvider });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Ship Outbound</AlertDialogTitle>
                    <AlertDialogDescription>
                        Input informasi pengiriman untuk {outboundNumber}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Carrier */}
                    <div>
                        <Label>Ekspedisi</Label>
                        <select
                            className="w-full border rounded-md px-3 py-2 text-sm"
                            value={shippingProvider}
                            onChange={(e) => setShippingProvider(e.target.value)}
                        >
                            <option value="">Pilih Ekspedisi</option>
                            <option value="JNE">JNE</option>
                            <option value="J&T">J&T Express</option>
                            <option value="SiCepat">SiCepat</option>
                            <option value="AnterAja">AnterAja</option>
                            <option value="Ninja">Ninja Xpress</option>
                            <option value="Internal">Kurir Internal</option>
                        </select>
                    </div>

                    {/* Tracking Number */}
                    <div>
                        <Label>Nomor Resi</Label>
                        <Input
                            placeholder="Masukkan nomor resi"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                        />
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <Button
                        onClick={handleConfirm}
                        disabled={!shippingProvider || !trackingNumber}
                    >
                        Konfirmasi Ship
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}