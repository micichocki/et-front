import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../utils/auth';

const ProtectedRoute = ({ element: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const isValid = await verifyToken();
      setIsAuthenticated(isValid);
    };

    checkAuthentication();
  }, []);
  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoute;

