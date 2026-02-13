import { createContext, useContext } from 'react';

export const UserContext = createContext(null);

export function useUserStore() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserStore must be used within AuthProvider');
    }
    return context;
}
