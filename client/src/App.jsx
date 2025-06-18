import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPge from './pages/LoginPage';
import ContactPage from './pages/ContactPage';
import ProtectedRoute from './routes/ProtectedRoute';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPge />} />
        <Route 
          path="/contact" 
          element={
            <ProtectedRoute>
              <ContactPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
