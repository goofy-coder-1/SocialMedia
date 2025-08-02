import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../../url';

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const resetEmail = localStorage.getItem('resetEmail');
    if (!resetEmail) {
      navigate('/reset-password'); // block direct access
    }
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${baseUrl}/api/users/verify-code`, { code });
      localStorage.removeItem('resetEmail');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code');
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <h2>Verify Code</h2>
      <input
        type="text"
        placeholder="6-digit code"
        value={code}
        maxLength={6}
        onChange={(e) => setCode(e.target.value)}
        required
      />
      <button type="submit">Verify</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default VerifyCode;




