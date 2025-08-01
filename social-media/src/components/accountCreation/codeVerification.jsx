import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../accountCreation/createaccount.css';
import { baseUrl } from '../../../url';

const CodeVerification = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const email = localStorage.getItem('pendingEmail');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/api/users/verify-code`, { email, code });
      setMessage('Account created successfully!');
      localStorage.removeItem('pendingEmail');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Verification failed.');
    }
    finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container text-center mt-4">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="centered-background">
      <div className="centered-overlay">
        <form className="centered-form" onSubmit={handleSubmit}>
          <h2>Email Verification</h2>
          <p className="verification-instruction">
            A 6-digit code has been sent to <strong>{email}</strong>. Please enter it below to complete your registration.
          </p>

          <div className="form-row">
            <label>Verification Code:</label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <button type="submit">Verify & Create Account</button>
          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CodeVerification;