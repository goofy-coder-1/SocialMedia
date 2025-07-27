import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../accountCreation/createaccount.css'; // Reuse the same styling

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/users/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/profile');
    } catch (err) {
      console.error('Login error:', err.message);
      setMessage(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="centered-background">
      <div className="centered-overlay">
        <form className="centered-form" onSubmit={handleSubmit}>
          <h1 style={{display: 'flex', justifyContent: 'center'}}>Log In</h1>

          <div className="form-row">
            <label>Email:</label>
            <input
              type="email"
              name="email"
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

          <button type="submit" className='text-center'>Log In</button>

          <h6 className="text-center" style={{color: 'white'}}>Don't have an account?</h6>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/signin">
              <button className="btn btn-primary">Create Account</button>
            </Link>
          </div>

          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
