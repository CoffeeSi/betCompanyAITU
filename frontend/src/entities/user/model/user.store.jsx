import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUserState] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
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

export function useUserStore() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserStore must be used within UserProvider');
    }
    return context;
}