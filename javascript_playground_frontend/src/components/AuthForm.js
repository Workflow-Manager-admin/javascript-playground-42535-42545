import React, { useState } from 'react';
import axios from 'axios';

// PUBLIC_INTERFACE
const AuthForm = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // PUBLIC_INTERFACE
  const validateForm = () => {
    const newErrors = {};

    if (isSignUp && !formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (isSignUp && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin';
      const payload = isSignUp 
        ? { username: formData.username, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await axios.post(endpoint, payload);

      if (response.data.status === 'success') {
        const { user, token } = response.data.data;
        onLogin(user, token);
      } else {
        setErrors({ submit: response.data.message || 'Authentication failed' });
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (error.response?.status === 409) {
        setErrors({ submit: 'User already exists. Please sign in instead.' });
      } else if (error.response?.status === 401) {
        setErrors({ submit: 'Invalid credentials. Please check your email and password.' });
      } else {
        setErrors({ submit: error.response?.data?.message || 'Authentication failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ username: '', email: '', password: '' });
    setErrors({});
  };

  return (
    <div className="form-container">
      <h2 className="text-center mb-16">
        {isSignUp ? 'Create Account' : 'Sign In'}
      </h2>

      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your username"
            />
            {errors.username && (
              <div className="form-error">{errors.username}</div>
            )}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your email"
          />
          {errors.email && (
            <div className="form-error">{errors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
            placeholder={isSignUp ? "At least 6 characters" : "Enter your password"}
          />
          {errors.password && (
            <div className="form-error">{errors.password}</div>
          )}
        </div>

        {errors.submit && (
          <div className="form-error mb-16">{errors.submit}</div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </button>
      </form>

      <div className="text-center mt-16">
        <p>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button 
            type="button"
            onClick={toggleMode}
            className="btn btn-outline"
            style={{ marginLeft: '8px' }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
