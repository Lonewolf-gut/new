import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { type UserRole } from '@/types/interfaces';
import { ROUTES } from '@/utils/constants';
import React from 'react';
import { Navigate, useLocation } from 'react-router';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles
}) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const location = useLocation()
    
    // If we have user data, show the dashboard immediately (don't wait for query)
    // Only show loading if we don't have user AND we're loading
    if (!user && isLoading) {
        console.log("ProtectedRoute: Loading user data...", { isLoading, hasUser: !!user, isAuthenticated });
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner text='Loading your dashboard...' />
            </div>
        );
    }
    
    // If we have user data, proceed immediately (even if query is still running)
    if (user) {
        console.log("ProtectedRoute: User data available, proceeding", { userRole: user.role });
    }

    // If not authenticated (no token), redirect to auth
    if (!isAuthenticated) {
        console.log("ProtectedRoute: Not authenticated - no token", { isAuthenticated, hasToken: !!localStorage.getItem("auth_token") });
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // If authenticated but no user data yet (shouldn't happen after loading, but just in case)
    if (!user) {
        console.log("ProtectedRoute: Authenticated but no user data - this shouldn't happen", { isAuthenticated, isLoading });
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner text='Loading your dashboard...' />
            </div>
        );
    }

    if (!allowedRoles.includes(user.role as UserRole)) {
        const route = ROUTES[user.role as UserRole];
        const dashboardPath = typeof route === 'string' ? route : route.DASHBOARD;
        return <Navigate to={dashboardPath} replace />;
    }


    return <>{children}</>;
};

