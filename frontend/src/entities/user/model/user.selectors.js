import { useUserStore } from './user.store.jsx';

export const useUser = () => useUserStore().user;
export const useIsAuthenticated = () => useUserStore().isAuthenticated;
export const isAuthenticated = (user) => Boolean(user);
export const useUserError = () => useUserStore().error;

export const useUserActions = () => {
    const { setUser, setError, logout, clearError } = useUserStore();
    return { setUser, setError, logout, clearError };
};

