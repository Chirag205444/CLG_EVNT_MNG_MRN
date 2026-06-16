import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UserRegister from './pages/UserRegister';
import UserLogin from './pages/UserLogin';
import Welcomepage from './pages/Welcomepage';
import Home from './pages/Home';

function MainRoute() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem('user');
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('auth-change', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('auth-change', handleStorage);
    };
  }, []);

  if (user) {
    return (
      <Home
        user={user}
        onLogout={() => {
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('auth-change'));
        }}
      />
    );
  }
  return <Welcomepage />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Welcome or Main Authenticated Home Page */}
        <Route path="/" element={<MainRoute />} />
        
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
