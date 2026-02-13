import { useState, useEffect } from 'react';
import { teamApi } from '../api/teamApi';

export const useTeam = (teamId) => {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!teamId) return;
        const fetchTeam = async () => {
            try {
                setLoading(true);
                const response = await teamApi.fetchTeamByID(teamId);
                setTeam(response);
            } catch (err) {
                setError(err?.response?.data?.error || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, [teamId]);

    return { team, loading, error };
};