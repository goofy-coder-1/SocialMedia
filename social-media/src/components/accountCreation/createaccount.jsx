import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../accountCreation/createaccount.css';

const CenteredForm = () => {
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
      await axios.post('http://localhost:4000/api/users/request-code', formData);
      localStorage.setItem('pendingEmail', formData.email);
      navigate('/code');
    } catch (err) {
      console.error('Registration error:', err.message);
      setMessage(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="centered-background">
      <div className="centered-overlay">
        <form className="centered-form" onSubmit={handleSubmit}>
          <h1>Create Account</h1>

          {['name', 'email', 'age', 'contactno', 'password'].map((field, index) => (
            <div className="form-row" key={index}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : field === 'age' ? 'number' : 'text'}
                name={field}
                required
                onChange={handleChange}
              />
            </div>
          ))}

          <button type="submit">Register</button>

          <h6 className="text-center" style={{color: 'white'}}>Already have an account?</h6>
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
