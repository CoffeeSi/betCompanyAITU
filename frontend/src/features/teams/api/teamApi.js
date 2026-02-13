import { api } from '@/shared/api/request';

export const teamApi = {
    async fetchTeamByID(teamID) {
        const response = await api.get(`/teams/id/${teamID}`);
        return response.data;
    },
    async fetchTeamsBySport(sportId) {
        const response = await api.get(`/teams/${sportId}`);
        return response.data;
    }
}