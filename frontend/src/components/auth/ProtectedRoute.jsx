import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ requiredRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-surface-600 dark:text-surface-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If required roles are specified, check if user has one of them
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-surface-600 dark:text-surface-400 mb-4">Your role doesn't have access to this area.</p>
          <a href="/" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;

