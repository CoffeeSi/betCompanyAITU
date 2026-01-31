import { authApi } from '@/shared/api/authApi';
import { useUserStore } from '@/entities/user/model/user.store.jsx';

export const useRegister = () => {
    const { setUser, setError } = useUserStore();
    
    const register = async (userData) => {
        try {
            setError(null);
            
            if (userData.password !== userData.confirm_password) {
                throw new Error('Passwords do not match');
            }
            
            await authApi.register(userData);
            
            const loginData = await authApi.login({
                email: userData.email,
                password: userData.password
            });
            
            if (loginData.token) {
                localStorage.setItem('access_token', loginData.token);
                setUser({ 
                    email: userData.email,
                    full_name: userData.full_name 
                });
            }
            
            return { success: true };
        } catch (error) {
            let errorMessage = 'Registration failed';
            
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
    
    return { register };
};