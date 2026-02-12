// features/admin/hooks/useUsers.js
// Custom hooks for managing users

import { useState, useEffect, useCallback } from 'react';
import { adminApiService } from '../api/adminApi.service';

export function useUsers(params) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await adminApiService.getUsers(params);
    
    if (apiError) {
      setError(apiError);
    } else {
      setUsers(data || []);
    }
    
    setLoading(false);
  }, [params?.role, params?.page, params?.limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}

export function useAssignRole() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const assignRole = useCallback(async (userId, role) => {
    setLoading(true);
    setError(null);
    
    const { error: apiError } = await adminApiService.assignRole(userId, role);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true };
  }, []);

  return { assignRole, loading, error };
}

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUser = useCallback(async (id, user) => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await adminApiService.updateUser(id, user);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true, data };
  }, []);

  return { updateUser, loading, error };
}

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    const { error: apiError } = await adminApiService.deleteUser(id);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true };
  }, []);

  return { deleteUser, loading, error };
}