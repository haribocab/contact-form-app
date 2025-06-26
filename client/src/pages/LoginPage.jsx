// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './../redux/authSlice';
import AppLayout from '../layouts/AppLayout';
import { UserCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const apiUrl = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!credentials.username.trim() || !credentials.password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.username.trim(),
          password: credentials.password
        }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        dispatch(loginSuccess({ token: data.token, user: data.user }));
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        setErrorMessage(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

        {errorMessage && (
          <div className="mb-4 text-red-700 bg-red-100 px-4 py-2 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <UserCircleIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter your username"
                disabled={loading}
                className={`w-full pl-10 pr-4 py-2 rounded-md border 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${errorMessage && !credentials.username.trim() ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
                className={`w-full pl-10 pr-4 py-2 rounded-md border 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${errorMessage && !credentials.password ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="mt-2 text-center text-sm">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:underline"
          >
            Back to Home
          </button>
        </p>
      </div>
    </AppLayout>
  );
}
