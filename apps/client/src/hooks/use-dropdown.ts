import { useEffect, useState } from 'react';
import { fetchItems } from '@/api/item.api';
import { fetchLocation } from '@/api/location.api';

export const useDropdownOptions = () => {
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [p, w] = await Promise.all([
                    fetchItems(),
                    fetchLocation(),
                ]);
                setProducts(p);
                setWarehouses(w);
            } catch (err) {
                console.error('Gagal fetch dropdown:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    return { products, warehouses, loading };
};