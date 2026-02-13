import { api } from '@/shared/api/request';

export const betsApi = {
    placeBet: async ({ amount, outcomeIds, type }) => {
        const response = await api.post('/bet', {
            amount,
            outcome_ids: outcomeIds,
            type,
        });
        return response.data;
    },

    getUserBets: async () => {
        const response = await api.get('/bet/my');
        return response.data;
    },

    settleBet: async (betId, isWinner) => {
        const response = await api.put('/bet', {
            bet_id: betId,
            is_winner: isWinner,
        });
        return response.data;
    },
};
