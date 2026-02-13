import { useState, useEffect, useCallback } from 'react';
import { adminApiService } from '../api/adminApi.service';

export function useEvents(sportId, page = 1, pageSize = 10) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page, pageSize, total: 0, totalPages: 0 });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const params = { 
      page: pagination.page, 
      page_size: pagination.pageSize 
    };
    
    if (sportId) {
      params.sport_id = sportId;
    }
    
    const { data, error: apiError } = await adminApiService.getEvents(params);
    
    if (apiError) {
      setError(apiError);
      setEvents([]);
    } else {
      const eventsData = Array.isArray(data) ? data : data?.events || [];
      const totalItems = data?.total_items || 0;
      const totalPages = data?.total_pages || 0;
      
      setEvents(eventsData);
      setPagination(prev => ({ ...prev, total: totalItems, totalPages }));
    }
    
    setLoading(false);
  }, [pagination.page, pagination.pageSize, sportId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const goToPage = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  const setPageSize = useCallback((newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
  }, []);

  return { events, loading, error, pagination, goToPage, setPageSize, refetch: fetchEvents };
}

export function useCreateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createEvent = useCallback(async (event) => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await adminApiService.createEvent(event);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true, data };
  }, []);

  return { createEvent, loading, error };
}

export function useUpdateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateEvent = useCallback(async (id, event) => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await adminApiService.updateEvent(id, event);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true, data };
  }, []);

  return { updateEvent, loading, error };
}

export function useDeleteEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteEvent = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    const { error: apiError } = await adminApiService.deleteEvent(id);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true };
  }, []);

  return { deleteEvent, loading, error };
}

export function useEventTeams() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const assignTeam = async (eventId, data) => {
    try {
      const result = await adminApiService.assignTeamToEvent(eventId, data);
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Failed to assign teams' 
      };
    }
  };
  const removeTeam = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    const { error: apiError } = await adminApiService.removeTeamFromEvent(id);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true };
  }, []);

  return { assignTeam, removeTeam, loading, error };
}