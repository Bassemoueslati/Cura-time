import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'client' | 'doctor';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/login'
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole && user.user_role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const dashboardRoutes = {
      admin: '/admin/dashboard',
      client: '/dashboard',
      doctor: '/doctor/dashboard'
    };
    
    return <Navigate to={dashboardRoutes[user.user_role]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
