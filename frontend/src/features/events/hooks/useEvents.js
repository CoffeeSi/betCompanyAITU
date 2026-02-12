import { useEffect, useState } from 'react';
import { eventApi } from '../api/eventApi';

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async (page = 1, pageSize = 12) => {
            try {
                setLoading(true);
                const response = await eventApi.fetchEvents(page, pageSize);

                setEvents(response.events);
                setPage(response.page);
                setPageSize(response.pageSize);
                setTotalPages(response.totalPages);
                setTotal(response.total);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents(page, pageSize);
    }, [page, pageSize]);
    

    return { events, page, pageSize, totalPages, total, loading, error };
}