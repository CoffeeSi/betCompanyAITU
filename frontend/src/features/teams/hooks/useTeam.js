import { useState, useEffect } from 'react';
import { teamApi } from '../api/teamApi';

export const useTeam = (eventID) => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamsByEvent = async (eventID) => {
            try {
                setLoading(true);
                const response = await teamApi.fetchTeamsByEvent(eventID);

                setTeams(response.teams);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTeamsByEvent(eventID);
    }, [eventID]);

    return { teams, loading, error}
}