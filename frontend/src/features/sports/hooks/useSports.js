import { useState, useEffect } from "react";
import { sportsApi } from "../api/sportsApi";


export const useSports = () => {
    const [sports, setSports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSports = async () => {
            try {
                setLoading(true);
                const respones = await sportsApi.fetchSports();
                const data = respones.sports
                setSports(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSports();
    }, []);

    return { sports, loading, error };
}