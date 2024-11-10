import React, { useEffect } from 'react';

const Logout = () => {
    useEffect(() => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
    }, []);
  
    return <div>Logging out...</div>;
  };
  
  export default Logout;