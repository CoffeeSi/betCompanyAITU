import axios from "axios";

export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use((config) => {
        const token = localStorage.getItem('access_token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use((response) => response, 
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('/api/auth/token/refresh', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const newToken = response.data.token;
                localStorage.setItem('access_token', newToken);
                
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);