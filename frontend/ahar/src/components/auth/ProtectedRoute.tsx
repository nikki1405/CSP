import { Navigate, useLocation } from 'react-router-dom';
// Update the import path below to the correct location of your useAuth hook
import { useAuth } from '../../hooks/useAuth';
// Define UserRole here if not available elsewhere
export type UserRole = 'ngo' | 'donor';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // You can show a loading spinner here
        return <div>Loading...</div>;
    }

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard if user's role is not allowed
        return <Navigate 
            to={user.role === 'ngo' ? '/ngo-dashboard' : '/donor-dashboard'} 
            replace 
        />;
    }

    return <>{children}</>;
}
