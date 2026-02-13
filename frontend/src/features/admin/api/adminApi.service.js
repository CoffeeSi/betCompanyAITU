import { api } from '@/shared/api/request';

const handleResponse = async (apiCall) => {
  try {
    const response = await apiCall();
    return { data: response.data, error: null };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    return { data: null, error: errorMessage };
  }
};

export const adminApiService = {
  // ============ EVENTS ============
  getEvents: (params) => 
    handleResponse(() => api.get('/events', { params })),
  
  createEvent: (event) => 
    handleResponse(() => api.post('/events', event)),
  
  updateEvent: (id, event) => 
    handleResponse(() => api.put(`/events/${id}`, event)),
  
  deleteEvent: (id) => 
    handleResponse(() => api.delete(`/events/${id}`)),

  // ============ EVENT TEAMS ============
  assignTeamToEvent: (eventId, data) => 
    handleResponse(() => api.post(`/event-teams/${eventId}`, data)),

  removeTeamFromEvent: (id) => 
    handleResponse(() => api.delete(`/event-teams/${id}`)),

  // ============ TEAMS ============
  getTeams: (sportId) => {
    const params = sportId ? { sport_id: sportId } : {};
    return handleResponse(() => api.get('/teams', { params }));
  },
  
  createTeam: (team) => 
    handleResponse(() => api.post('/teams', team)),
  
  updateTeam: (id, team) => 
    handleResponse(() => api.put(`/teams/${id}`, team)),
  
  deleteTeam: (id) => 
    handleResponse(() => api.delete(`/teams/${id}`)),

  // ============ USERS ============
  getUsers: (params) => 
    handleResponse(() => api.get('/users', { params })),
  
  assignRole: (userId, role) => 
    handleResponse(() => api.patch(`/users/${userId}/role`, { role })),
  
  updateUser: (id, user) => 
    handleResponse(() => api.put(`/users/${id}`, user)),
  
  deleteUser: (id) => 
    handleResponse(() => api.delete(`/users/${id}`)),

  // ============ MARKETS ============
  getMarkets: (params) => 
    handleResponse(() => api.get('/markets', { params })),
  
  createMarket: (market) => 
    handleResponse(() => api.post('/markets', market)),
  
  updateMarket: (id, market) => 
    handleResponse(() => api.put(`/markets/${id}`, market)),
  
  deleteMarket: (id) => 
    handleResponse(() => api.delete(`/markets/${id}`)),

  // ============ OUTCOMES ============
  getOutcomes: (marketId) => 
    handleResponse(() => api.get(`/markets/${marketId}/outcomes`)),
  
  createOutcome: (outcome) => 
    handleResponse(() => api.post('/outcomes', outcome)),
  
  updateOutcome: (id, outcome) => 
    handleResponse(() => api.put(`/outcomes/${id}`, outcome)),
  
  deleteOutcome: (id) => 
    handleResponse(() => api.delete(`/outcomes/${id}`)),

  // ============ STATISTICS ============
  getStatistics: () => 
    handleResponse(() => api.get('/admin/statistics')),

  getDashboardData: () => 
    handleResponse(() => api.get('/admin/dashboard')),
};
