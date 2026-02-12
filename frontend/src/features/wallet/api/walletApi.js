import { api } from '@/shared/api/request';

export const walletApi = {
    fetchBalance: async (userId) => {
        const response = await api.get(`/wallet/${userId}`);
        return response.data;
    },
    depositBalance: async (userId, amount) => {
        const response = await api.post(`/wallet/${userId}/deposit`, { amount });
        return response.data;
    },
    withdrawBalance: async (userId, amount) => {
        const response = await api.post(`/wallet/${userId}/withdraw`, { amount });
        return response.data;
    },
    fetchTransactions: async (userId) => {
        const response = await api.get(`/wallet/${userId}/transactions`);
        return response.data;
    }
}