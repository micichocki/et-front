import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../utils/auth'; 

const CommonPage = ({ children: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const isValid = await verifyToken();
      setIsAuthenticated(isValid);
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (isAuthenticated) return <Navigate to="/dashboard" />;

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <Component />
    </section>
  );
};

export default CommonPage;
