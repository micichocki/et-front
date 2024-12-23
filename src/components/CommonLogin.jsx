import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useLocation, useNavigate } from 'react-router-dom';

const CustomLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.backendUrl}/api/login/`, { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      if (response.status === 200) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Login failed. Account not found. Please check your credentials and try again.');
    }
  };

  return (
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0" style={{ background: '#f0f4f8' }}>
        <div className="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0">
          <div className="text-center p-5">
            <h1 className="text-3xl font-bold text-indigo-700">Welcome Back!</h1>
            <p className="text-gray-500">Fill the data to access your account</p></div>
          <div className="p-6 sm:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {message && !error && (
                  <div className="text-green-600 text-sm">
                    {message}
                  </div>
              )}

              {error && (
                  <div className="text-red-600 text-sm">
                    {error}
                  </div>
              )}

              <div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Sign In
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don’t have an account?{' '}
              <a href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
  );
};

export default CustomLogin;
