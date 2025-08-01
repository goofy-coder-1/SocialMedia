import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '/src/contextapi/usercontext.jsx';
import '../accountCreation/createaccount.css';
import { baseUrl } from '../../../url';

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/api/users/login`, formData);

      // Save token in localStorage
      localStorage.setItem('token', res.data.token);

      // Save user data in localStorage and update context
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
      }

      navigate('/profile');
    } catch (err) {
      console.error('Login error:', err.message);
      setMessage(err.response?.data?.message || 'Login failed.');
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
          <h1 style={{ display: 'flex', justifyContent: 'center' }}>Log In</h1>

          <div className="form-row">
            <label>Email:</label>
            &nbsp;
            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div className="form-row">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              required
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          <button type="submit" className="text-center">
            Log In
          </button>

          <h6 className="text-center" style={{ color: 'white' }}>
            Don't have an account?
          </h6>
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

