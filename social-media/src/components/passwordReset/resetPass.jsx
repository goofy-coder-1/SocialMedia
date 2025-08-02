import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../accountCreation/createaccount.css';
import { baseUrl } from '../../../url';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [formData, setFormData] = useState({ email: '', newPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${baseUrl}/api/users/change-password`, {
        email: formData.email,
        newPassword: formData.newPassword,
      });
      // Save email locally for verification step
      localStorage.setItem('resetEmail', formData.email);
      navigate('/verifycodepass');
      toast.success('code sent to your email');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send verification code.');
      toast.error('error sending code');
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
          <h1 style={{ display: 'flex', justifyContent: 'center' }}>Reset Password</h1>

          <div className="form-row">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              required
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="text-center">Send Verification Code</button>

          {message && <p className="form-message">{message}</p>}

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <h5>Remembered your password?</h5>
            <Link to="/login"> Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;


