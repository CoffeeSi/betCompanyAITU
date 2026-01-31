import { useUserStore } from '../store/userContext';

export const useAuth = () => {
    const { 
        user, 
        isAuthenticated, 
        error, 
        setUser, 
        setError, 
        logout, 
        clearError 
    } = useUserStore();

    return {
        user,
        isAuthenticated,
        error,
        setUser,
        setError,
        logout,
        clearError,
        isLoggedIn: isAuthenticated && Boolean(user),
        hasToken: Boolean(localStorage.getItem('access_token'))
    };
};

export const useUser = () => {
    const { user } = useAuth();
    return user;
};

export const useIsAuthenticated = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated;
};

export const useUserError = () => {
    const { error } = useAuth();
    return error;
};

export const useUserActions = () => {
    const { setUser, setError, logout, clearError } = useAuth();
    return { setUser, setError, logout, clearError };
};
