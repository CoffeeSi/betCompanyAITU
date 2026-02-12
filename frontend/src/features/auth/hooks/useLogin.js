import { authApi } from '@/features/auth/api/authApi';
import { useAuthContext } from '@/features/auth/store/authStore';

export const useLogin = () => {
    const { setUser, setError } = useAuthContext();
    
    const login = async (credentials) => {
        try {
            setError(null);
            
            const data = await authApi.login(credentials);
            
            if (data.token) {
                localStorage.setItem('access_token', data.token);
                setUser({ 
                    email: credentials.email,
                    full_name: data.user?.full_name || data.full_name
                });
            }
            
            return { success: true };
        } catch (error) {
            let errorMessage = 'Login failed';
            
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.message && !error.message.includes('status code')) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };
    
    return { login };
};
