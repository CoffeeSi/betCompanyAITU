import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/features/auth/store/authStore';
import { Loader, Center } from '@mantine/core';

export const ProtectedRoute = ({ element, requiredRoles = ['admin'] }) => {
    const { isAuthenticated, isLoading, user } = useAuthContext();
    
    const userRole = user?.role || user?.Role;
    
    if (isLoading) {
        return <Center style={{ height: '100vh' }}><Loader /></Center>;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!userRole) {
        return <Navigate to="/" replace />;
    }

    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const allowedRoles = rolesArray.map(role => role.toLowerCase());

    if (!allowedRoles.includes(userRole.toLowerCase())) {
        return <Navigate to="/" replace />;
    }

    return element;
};
