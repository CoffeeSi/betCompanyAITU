import { useState } from 'react';
import { betsApi } from '../api/betsApi';

export const usePlaceBet = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const placeBet = async ({ amount, outcomeIds, type = 'single' }) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            if (!amount || amount <= 0) {
                throw new Error('Amount must be greater than 0');
            }
            if (!outcomeIds || outcomeIds.length === 0) {
                throw new Error('Select at least one outcome');
            }

            const betType = type || (outcomeIds.length > 1 ? 'express' : 'single');
            await betsApi.placeBet({ amount, outcomeIds, type: betType });
            setSuccess(true);
            return true;
        } catch (err) {
            const msg = err?.response?.data?.error || err.message || 'Failed to place bet';
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setError(null);
        setSuccess(false);
    };

    return { placeBet, loading, error, success, reset };
};
