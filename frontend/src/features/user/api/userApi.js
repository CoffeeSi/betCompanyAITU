import { api } from '@/shared/api/request';

export const userApi = {
    fetchProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    }
}