import { useAuthContext } from '../store/authStore';

export const useRole = () => {
    const { user } = useAuthContext();
    const role = user?.role || user?.Role;
    return role?.toLowerCase() || null;
};

export const useIsAdmin = () => {
    const role = useRole();
    return role === 'admin';
};

export const useIsModerator = () => {
    const role = useRole();
    return role === 'moderator';
};

export const useIsUser = () => {
    const role = useRole();
    return role === 'user';
};

export const useHasRole = (requiredRole) => {
    const role = useRole();
    return role === requiredRole?.toLowerCase();
};

export const useHasAnyRole = (requiredRoles) => {
    const role = useRole();
    const normalizedRoles = Array.isArray(requiredRoles) 
        ? requiredRoles.map(r => r.toLowerCase()) 
        : [requiredRoles.toLowerCase()];
    return normalizedRoles.includes(role);
}

