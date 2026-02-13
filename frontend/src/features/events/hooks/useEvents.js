import { useEffect, useState, useCallback } from 'react';
import { eventApi } from '../api/eventApi';

export const useEvents = (sportId = null) => {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            let response;
            if (sportId) {
                response = await eventApi.fetchEventsBySport(sportId, page, pageSize);
            } else {
                response = await eventApi.fetchEvents(page, pageSize);
            }

            setEvents(response.events || []);
            setTotalPages(response.total_pages || response.totalPages || 0);
            setTotal(response.total_items || response.total || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, sportId]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    useEffect(() => {
        setPage(1);
    }, [sportId]);

    return { events, page, setPage, pageSize, totalPages, total, loading, error };
}