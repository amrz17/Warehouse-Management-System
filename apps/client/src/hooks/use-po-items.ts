// hooks/usePOItems.ts
import { useState, useEffect } from 'react';
import { getToken } from '@/services/auth.service';

export const usePOItems = (poId: string) => {
    const [poItems, setPoItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);

    useEffect(() => {
        if (!poId) {
            setPoItems([]); // reset kalau PO di-clear
            return;
        }

        const fetchPOItems = async () => {
            setLoadingItems(true);
            try {
                const res = await fetch(`/api/purchase-order/${poId}/items`, {
                    headers: { 'Authorization': `Bearer ${getToken()}` }
                });
                const data = await res.json();
                setPoItems(Array.isArray(data) ? data : data.data ?? []);
            } catch (err) {
                console.error('Gagal fetch PO items:', err);
            } finally {
                setLoadingItems(false);
            }
        };

        fetchPOItems();
    }, [poId]); // ← jalan ulang setiap poId berubah

    return { poItems, loadingItems };
};