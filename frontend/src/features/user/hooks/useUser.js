import { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';

export const useUser = () => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const data = await userApi.fetchProfile();                
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    return { user, loading, error };
}