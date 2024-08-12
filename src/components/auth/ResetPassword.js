import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = ({ setMessageType, showMessage }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL params
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showMessage('All fields are required');
      setMessageType('error');
      return;
    }

    if (password !== confirmPassword) {
      showMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/users/reset-password/${token}`, { password });
debugger
      if (response.statusText === "OK") {
        showMessage('Password has been reset successfully');
        setMessageType('success');
        setTimeout(() => {
          navigate('/login');
        }, 4000);
      } else {
        showMessage(response.data.message || 'Failed to reset password');
        setMessageType('error');
      }
    } catch (error) {
      showMessage('An error occurred while resetting your password');
      setMessageType('error');
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 10000);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg" style={{ background: 'linear-gradient(to right, #ff7e5f, #feb47b)', maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Reset Password</h2>
        
        <form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">New Password:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ backgroundColor: 'rgb(175 202 226)' }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ backgroundColor: 'rgb(175 202 226)' }}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
