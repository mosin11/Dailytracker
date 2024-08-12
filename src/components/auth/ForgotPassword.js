import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = ({ setMessageType, showMessage }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showMessage('Email is required');
      setMessageType('error');
      return;
    }

    try {
      // Replace '/api/users/forgot-password' with the actual endpoint of your backend
      const response = await axios.post(`${BASE_URL}/users/forgot-password`, { email });
debugger
      if (response.status === 200) {
        showMessage('Password reset link has been sent to your email');
        setMessageType('success');
        setTimeout(() => {
          navigate('/login');
        }, 4000);
      } else {
        showMessage(response.data.message || 'Failed to send reset link');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error during password reset request:', error);
      showMessage('An error occurred while sending the reset link');
      setMessageType('error');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg" style={{ background: 'linear-gradient(to right, #ff7e5f, #feb47b)', maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Forgot Password</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ backgroundColor: 'rgb(175 202 226)' }}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
