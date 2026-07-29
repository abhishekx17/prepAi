import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from '../../ai/components/LoadingScreen';

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingScreen message="Authenticating session" />;
  }
  if (!user) {
    return <Navigate to={'/login'} />;
  }
  return children;
};

export default Protected;
