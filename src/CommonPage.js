import React from 'react';

function CommonPage({ LoginComponent }) {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-green-500 rounded-full opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-red-500 rounded-full opacity-50"></div>
      <div className="relative z-10">
        <LoginComponent />
      </div>
    </div>
  );
}

export default CommonPage;