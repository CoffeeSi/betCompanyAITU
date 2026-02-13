import { useState, useEffect, useCallback } from 'react';
import { adminApiService } from '../api/adminApi.service';

export function useTeams(sportId, page = 1, pageSize = 10) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page, pageSize, total: 0, totalPages: 0 });

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const params = { 
      page: pagination.page, 
      page_size: pagination.pageSize 
    };
    
    if (sportId) {
      params.sport_id = sportId;
    }
    
    const { data, error: apiError } = await adminApiService.getTeams(params);
    
    if (apiError) {
      setError(apiError);
      setTeams([]);
    } else {
      const teamsData = Array.isArray(data) ? data : data?.teams || [];
      const totalItems = data?.total_items || 0;
      const totalPages = data?.total_pages || 0;
      
      setTeams(teamsData);
      setPagination(prev => ({ ...prev, total: totalItems, totalPages }));
    }
    
    setLoading(false);
  }, [pagination.page, pagination.pageSize, sportId]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const goToPage = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  const setPageSize = useCallback((newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
  }, []);

  return { teams, loading, error, pagination, goToPage, setPageSize, refetch: fetchTeams };
}

export function useCreateTeam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTeam = useCallback(async (team) => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await adminApiService.createTeam(team);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true, data };
  }, []);

  return { createTeam, loading, error };
}

export function useUpdateTeam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTeam = useCallback(async (id, team) => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await adminApiService.updateTeam(id, team);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true, data };
  }, []);

  return { updateTeam, loading, error };
}

export function useDeleteTeam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteTeam = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    const { error: apiError } = await adminApiService.deleteTeam(id);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true };
  }, []);

  return { deleteTeam, loading, error };
}