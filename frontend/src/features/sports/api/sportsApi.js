import { api } from '@/shared/api/request';

export const sportsApi = {
    fetchSports: async () => {
        const response = await api.get('/sports');
        return response.data;
    },
};