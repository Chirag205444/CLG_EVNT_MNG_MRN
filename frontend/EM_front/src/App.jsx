import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UserRegister from './pages/UserRegister';
import UserLogin from './pages/UserLogin';
import Welcomepage from './pages/Welcomepage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Welcome Landing Page */}
        <Route path="/" element={<Welcomepage />} />
        
        {/* Support both standard clean URLs and user/ prefixed legacy paths */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/user/login" element={<Navigate to="/login" replace />} />
        
        <Route path="/register" element={<UserRegister />} />
        <Route path="/user/register" element={<Navigate to="/register" replace />} />
        
        {/* Fallback for undefined routes redirecting to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
