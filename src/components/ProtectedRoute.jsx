import React, {useEffect, useRef, useState} from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../utils/auth';
import Navbar from './Navbar';
import axios from "../axiosConfig";
import ChatWidget from "./ChatWidget";

const ProtectedRoute = ({ element: Component }) => {
  const chatWidgetRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [data, setData] = useState(null);
  const [recipient, setRecipient] = useState('');

  const handleSendMessageToTutor = (tutor) => {
    setRecipient(tutor);
    if (chatWidgetRef.current) {
      chatWidgetRef.current.startChatWith(tutor);
    }
  };

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
        <Component user={data} onSendMessage={handleSendMessageToTutor} />
        <ChatWidget user={data} ref={chatWidgetRef} recipient={recipient} />
      </div> :
      <Navigate to="/" />;

};

export default ProtectedRoute;