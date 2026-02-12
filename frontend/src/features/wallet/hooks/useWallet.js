import { useState, useEffect, useCallback } from 'react';
import { walletApi } from '../api/walletApi';

export const useWallet = (userId) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWallet = useCallback(async () => {
    if (!userId) {
      setWallet(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await walletApi.fetchBalance(userId);
      setWallet(data);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to load wallet');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return { wallet, loading, error, refresh: fetchWallet };
};