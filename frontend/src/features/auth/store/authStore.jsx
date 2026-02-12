import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

