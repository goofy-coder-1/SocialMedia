import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../accountCreation/createaccount.css';
import { baseUrl } from '../../../url';
import { toast } from 'react-toastify';

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${baseUrl}/api/users/verify-reset-code`, { code });
      setMessage('Password reset successful! Redirecting to login...');
      localStorage.removeItem('resetEmail');
      setTimeout(() => navigate('/login'), 2000);
      toast.success('code verification successful')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid or expired code.');
      toast.error('code invalid or expired')
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="centered-background">
      <div className="centered-overlay">
        <form className="centered-form" onSubmit={handleSubmit}>
          <h1 style={{ display: 'flex', justifyContent: 'center' }}>Verify Reset Code</h1>

          <div className="form-row">
            <label>Verification Code:</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <button type="submit">Verify & Reset Password</button>

          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default VerifyCode;



