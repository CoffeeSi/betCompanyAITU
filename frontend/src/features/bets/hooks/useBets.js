import { useState, useEffect, useCallback } from 'react';
import { betsApi } from '../api/betsApi';

export const useBets = () => {
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBets = useCallback(async () => {
        try {
            setLoading(true);
            const data = await betsApi.getUserBets();
            setBets(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            setError(err?.response?.data?.error || err.message || 'Failed to load bets');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBets();
    }, [fetchBets]);

    const stats = {
        activeBets: bets.filter(b => b.status === 'pending').length,
        wonBets: bets.filter(b => b.status === 'win').length,
        lostBets: bets.filter(b => b.status === 'lost').length,
        get winRate() {
            const settled = this.wonBets + this.lostBets;
            return settled > 0 ? (this.wonBets / settled) * 100 : 0;
        },
    };

    return { bets, stats, loading, error, refetch: fetchBets };
};
