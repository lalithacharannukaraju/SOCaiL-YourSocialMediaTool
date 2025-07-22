/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import About from './pages/About'
import Home from './pages/Home'
import FAQ from './pages/FAQ'
import LoginForm from './pages/Login'
import Pricing from './pages/Pricing'
import Dashboard from './authpages/Dashboard'
import Sidebar from './Dikhsuchi/Sidebar'
import Navbar from './Dikhsuchi/Navbar'
import Chatbot from './authpages/Chatbot'
import Writer from './authpages/Writer'
import Compiler from './authpages/Compiler'
import './tailwind.css'
import axios from 'axios';

// PrivateRoute component for protected routes
function PrivateRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" />
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();

  // Check localStorage for the token and validate with backend on component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Validate token with backend
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      axios.get(`${BACKEND_URL}/chat-history`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
        .then(() => {
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        })
        .finally(() => setAuthLoading(false));
    } else {
      setIsAuthenticated(false);
      setAuthLoading(false);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen text-xl text-gray-600">Checking authentication...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Only render Navbar when not authenticated */}
      {!isAuthenticated && <Navbar />}

      <div className="flex flex-1">
        {/* Only render Sidebar when authenticated and not on /login */}
        {isAuthenticated && location.pathname !== '/login' && <Sidebar handleLogout={handleLogout} />}

        <div className={`flex-1 ${isAuthenticated && location.pathname !== '/login' ? 'ml-16' : ''}`}>
          <Routes>
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />

            {/* Login route */}
            <Route 
              path="/login" 
              element={<LoginForm onLogin={handleLogin} />} 
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Chatbot />
                </PrivateRoute>
              }
            />
            <Route
              path="/writer"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Writer />
                </PrivateRoute>
              }
            />
            <Route
              path="/compiler"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Compiler />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
