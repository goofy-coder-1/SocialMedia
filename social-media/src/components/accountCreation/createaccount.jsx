import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../accountCreation/createaccount.css';
import { baseUrl } from '../../../url.js'

const CenteredForm = () => {
  const [isLoading, setIsLoading] = useState(true);
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
      <div className="container text-center mt-4">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }
  return (
    <div className="centered-background">
      <div className="centered-overlay">
        <form className="centered-form" onSubmit={handleSubmit}>
          <h1>Create Account</h1>

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
            <label>Phone Number:</label>
            <input
              type="text"
              name="contactno"
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

          <h6 className="text-center" style={{ color: 'white' }}>Already have an account?</h6>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/login">
              <button className="btn btn-danger">Log In</button>
            </Link>
          </div>

          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CenteredForm;

