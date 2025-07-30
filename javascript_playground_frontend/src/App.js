import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import CodeEditor from './components/CodeEditor';
import AuthForm from './components/AuthForm';
import SnippetManager from './components/SnippetManager';
import ExecutionHistory from './components/ExecutionHistory';
import SharedSnippet from './components/SharedSnippet';
import './App.css';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// PUBLIC_INTERFACE
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // PUBLIC_INTERFACE
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      if (response.data.status === 'success') {
        setUser(response.data.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  // PUBLIC_INTERFACE
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              user ? <CodeEditor user={user} /> : <Navigate to="/auth" />
            } />
            <Route path="/auth" element={
              user ? <Navigate to="/" /> : <AuthForm onLogin={handleLogin} />
            } />
            <Route path="/snippets" element={
              user ? <SnippetManager user={user} /> : <Navigate to="/auth" />
            } />
            <Route path="/history" element={
              user ? <ExecutionHistory user={user} /> : <Navigate to="/auth" />
            } />
            <Route path="/share/:token" element={<SharedSnippet />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
