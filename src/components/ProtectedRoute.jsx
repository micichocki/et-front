import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../utils/auth';
import Navbar from './Navbar';


const ProtectedRoute = ({ element: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const isValid = await verifyToken();
      setIsAuthenticated(isValid);
      if(!isValid) {
        <Navigate to="/" />;
      }
    };

    checkAuthentication();
  }, []);
  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? 
  <div>
  <Navbar/>
  <Component />
  </div> : 
  <Navigate to="/" />;
};

export default ProtectedRoute;

