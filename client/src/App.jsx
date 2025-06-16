import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPge from './pages/LoginPage';
import ContactPage from './pages/ContactPage';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
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
