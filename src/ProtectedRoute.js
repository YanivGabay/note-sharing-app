import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or some loading spinner
  }

  if (!currentUser) {
    return <Navigate to="/register" />;
  }

  return children;
};

export default ProtectedRoute;
