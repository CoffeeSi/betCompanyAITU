import { useState, useEffect, useCallback } from 'react';
import { eventApi } from '../api/eventApi';

export const useEventMarkets = (eventId) => {
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMarkets = useCallback(async () => {
        if (!eventId) return;
        try {
            setLoading(true);
            const data = await eventApi.fetchMarketsByEvent(eventId);
            setMarkets(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            setError(err?.response?.data?.error || err.message || 'Failed to load markets');
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        fetchMarkets();
    }, [fetchMarkets]);

    return { markets, loading, error, refetch: fetchMarkets };
};
