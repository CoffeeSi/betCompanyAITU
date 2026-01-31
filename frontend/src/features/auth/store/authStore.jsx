import { useState } from 'react';
import { UserContext } from './userContext';

export function AuthProvider({ children }) {
    const [user, setUserState] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return Boolean(localStorage.getItem('access_token'));
    });
    const [error, setErrorState] = useState(null);

    const setUser = (userData) => {
        setUserState(userData);
        setIsAuthenticated(true);
        setErrorState(null);
    };

    const setError = (err) => {
        setErrorState(err);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUserState(null);
        setIsAuthenticated(false);
        setErrorState(null);
    };

    const clearError = () => {
        setErrorState(null);
    };

    const value = {
        user,
        isAuthenticated,
        error,
        setUser,
        setError,
        logout,
        clearError,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}