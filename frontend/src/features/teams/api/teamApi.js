import { api } from '@/shared/api/request';

export const teamApi = {
    async fetchTeamByID(teamID) {
        const response = await api.get(`/teams/${teamID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch team');
        }
        return response.json();
    },
    async fetchTeamsByEvent(eventID) {
        const response = await api.get(`/teams/event/${eventID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch teams for event');
        }
        return response.json();
    }
}