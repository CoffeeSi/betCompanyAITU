// features/admin/hooks/useMarkets.js
// Custom hooks for managing markets and outcomes

import { useState, useCallback, useEffect } from 'react';
import { adminApiService } from '../api/adminApi.service';

export function useMarkets(params, page = 1, pageSize = 10) {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page, pageSize, total: 0, totalPages: 0 });

  const fetchMarkets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const requestParams = { 
      ...params,
      page: pagination.page, 
      page_size: pagination.pageSize 
    };
    
    const { data, error: apiError } = await adminApiService.getMarkets(requestParams);
    
    if (apiError) {
      setError(apiError);
      setMarkets([]);
    } else {
      // Handle different response structures
      const marketsData = Array.isArray(data) ? data : data?.markets || [];
      const totalItems = data?.total_items || 0;
      const totalPages = data?.total_pages || 0;
      
      setMarkets(marketsData);
      setPagination(prev => ({ ...prev, total: totalItems, totalPages }));
    }
    
    setLoading(false);
  }, [params, pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  const goToPage = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  const setPageSize = useCallback((newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
  }, []);

  return { markets, loading, error, pagination, goToPage, setPageSize, refetch: fetchMarkets };
}

export function useCreateMarket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createMarket = useCallback(async (market) => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await adminApiService.createMarket(market);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true, data };
  }, []);

  return { createMarket, loading, error };
}

export function useUpdateMarket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateMarket = useCallback(async (id, market) => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await adminApiService.updateMarket(id, market);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true, data };
  }, []);

  return { updateMarket, loading, error };
}

export function useDeleteMarket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteMarket = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    const { error: apiError } = await adminApiService.deleteMarket(id);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true };
  }, []);

  return { deleteMarket, loading, error };
}

// ============ OUTCOMES ============

export function useCreateOutcome() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOutcome = useCallback(async (outcome) => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await adminApiService.createOutcome(outcome);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true, data };
  }, []);

  return { createOutcome, loading, error };
}

export function useUpdateOutcome() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateOutcome = useCallback(async (id, outcome) => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await adminApiService.updateOutcome(id, outcome);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true, data };
  }, []);

  return { updateOutcome, loading, error };
}

export function useDeleteOutcome() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteOutcome = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    const { error: apiError } = await adminApiService.deleteOutcome(id);
    
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return { success: false, error: apiError };
    }
    
    setLoading(false);
    return { success: true };
  }, []);

  return { deleteOutcome, loading, error };
}