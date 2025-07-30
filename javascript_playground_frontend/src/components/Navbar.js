import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// PUBLIC_INTERFACE
const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  // PUBLIC_INTERFACE
  const isActive = (path) => {
    return location.pathname === path;
  };

  // PUBLIC_INTERFACE
  const handleLogout = async () => {
    try {
      // Optional: Call backend logout endpoint
      // await axios.post('/api/auth/signout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      onLogout();
    }
  };

  return (
    <nav className="navbar">
      <h1>JavaScript Playground</h1>
      
      {user ? (
        <div className="navbar-nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Editor
          </Link>
          <Link 
            to="/snippets" 
            className={`nav-link ${isActive('/snippets') ? 'active' : ''}`}
          >
            My Snippets
          </Link>
          <Link 
            to="/history" 
            className={`nav-link ${isActive('/history') ? 'active' : ''}`}
          >
            History
          </Link>
          <span className="nav-link">Welcome, {user.username}</span>
          <button 
            onClick={handleLogout}
            className="btn btn-secondary"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="navbar-nav">
          <Link 
            to="/auth" 
            className={`nav-link ${isActive('/auth') ? 'active' : ''}`}
          >
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
