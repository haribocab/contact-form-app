import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPge from './pages/LoginPage';
import UserHomePage from './pages/UserHomePage';
import ProtectedRoute from './routes/ProtectedRoute';
import HomePage from './pages/HomePage';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPge />} />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <UserHomePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
