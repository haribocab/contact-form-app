// src/hooks/useAuthCheck.js
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export default function useAuthCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const { exp } = jwtDecode(token);
      const now = Date.now() / 1000; // 現在時刻（秒）
      if (exp < now) {
        console.warn('Token expired, logging out...');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (err) {
      console.error('Invalid token:', err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);
}
