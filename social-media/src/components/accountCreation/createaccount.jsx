import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../accountCreation/createaccount.css';
import { baseUrl } from '../../../url.js'

const CenteredForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    contactno: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${baseUrl}/api/users/request-code`, formData);
      localStorage.setItem('pendingEmail', formData.email);
      navigate('/code');
    } catch (err) {
      console.error('Registration error:', err.message);
      setMessage(err.response?.data?.message || 'Something went wrong.');
    }
    finally {
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
          <h1>Create Account</h1>
          <h5 style={{ color: 'white' }}>Already have an account?</h5>
           <Link to="/login">
              <h3 >Log In</h3>
            </Link>
          <div className="form-row">
            <label>Full Name:</label>
            <input
              type="text"
              name="name"
              required
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Email Address:</label>
            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Age:</label>
            <input
              type="number"
              name="age"
              required
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              required
              onChange={handleChange}
            />
          </div>

          <button type="submit">Register</button>
          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CenteredForm;

