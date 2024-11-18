import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../utils/auth';
import Navbar from './Navbar';
import axios from "../axiosConfig";
import ChatWidget from "./ChatWidget";


const ProtectedRoute = ({ element: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const isValid = await verifyToken();
      setIsAuthenticated(isValid);
      if (isValid) {
        fetchData();
      } else {
        <Navigate to="/" />;
      }
    };

    checkAuthentication();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/tutoring/user/me/');
      const userData = response.data;
      setData(userData);
    } catch (err) {
      console.error(err);
    }
  };
  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? 
  <div>
  <Navbar user={data} />
  <Component user={data} />
    <ChatWidget user={data} />
  </div> : 
  <Navigate to="/" />;

};

export default ProtectedRoute;

