import { useState, useEffect, useCallback } from 'react';
import { walletApi } from '@/features/wallet/api/walletApi';
import { useAuthContext } from '@/features/auth/store/authStore';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await walletApi.fetchTransactions(user.id);
      // Handle both array and object with transactions property
      const transactionsData = Array.isArray(data) ? data : data?.transactions || [];
      setTransactions(transactionsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions');
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, error, refetch: fetchTransactions };
}
