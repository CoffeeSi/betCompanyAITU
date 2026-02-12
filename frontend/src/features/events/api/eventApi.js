import { api } from '@/shared/api/request';

export const eventApi = {
    fetchEvents: async (page, pageSize) => {
        const response = await api.get(`/events?page=${page}&page_size=${pageSize}`);
        return response.data;
    },
    fetchEvent: async (eventId) => {
        const response = await api.get(`/events/${eventId}`);
        return response.data;
    }
};