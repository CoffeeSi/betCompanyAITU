import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { userApi } from '@/features/user/api/userApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('access_token'));
  });
  const [error, setErrorState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (localStorage.getItem('access_token')) {
          const profile = await userApi.fetchProfile();
          setUserState(profile);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (!hasInitialized.current) {
      hasInitialized.current = true;
      initializeAuth();
    }
  }, []);

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
    isLoading,
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
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setUser: () => {},
      setError: () => {},
      logout: () => {},
      clearError: () => {},
    };
  }
  return context;
}

