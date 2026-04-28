import { useState, useEffect } from 'react';
import { getToken } from '@/services/auth.service';

export const useSOItems = (soId: string) => {
    const [soItems, setSoItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);

    useEffect(() => {
        if (!soId) {
            setSoItems([]); // reset kalau SO di-clear
            return;
        }

        const fetchSOItems = async () => {
            setLoadingItems(true);
            try {
                const res = await fetch(`/api/sale-order/${soId}/items`, {
                    headers: { 'Authorization': `Bearer ${getToken()}` }
                });
                const data = await res.json();
                setSoItems(Array.isArray(data) ? data : data.data ?? []);
            } catch (err) {
                console.error('Gagal fetch SO items:', err);
            } finally {
                setLoadingItems(false);
            }
        };

        fetchSOItems();
    }, [soId]); // ← jalan ulang setiap soId berubah

    return { soItems, loadingItems };
};