import { useEffect, useState } from 'react';
import { eventApi } from '../api/eventApi';
import { useParams } from 'react-router';

export const useEvent = (eventId) => {
    const [event, setEvent] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async (eventId) => {
            try {
                setLoading(true);
                const data = await eventApi.fetchEvent(eventId);                
                setEvent(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent(eventId);
    }, [eventId]);
    

    return { event, loading, error };
}