const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const tempStore = new Map();

// Registration Code Request
const requestVerificationCode = async (req, res) => {
  try {
    const { name, email, age, contactno, password } = req.body;
    const sanitizedEmail = email?.toLowerCase().trim();

    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    tempStore.set(sanitizedEmail, {
      name,
      email: sanitizedEmail,
      age,
      contactno,
      password: hashedPassword,
      verificationCode,
      codeExpiresAt
    });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: sanitizedEmail,
      subject: 'Your Verification Code',
      text: `Your code is ${verificationCode}. It expires in 30 minutes.`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Verification code sent to email.' });

  } catch (err) {
    console.error('Error sending verification code:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Registration Code Verification
const verifyEmailCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const sanitizedEmail = email?.toLowerCase().trim();
    const storedData = tempStore.get(sanitizedEmail);

    if (!storedData) {
      return res.status(404).json({ message: 'No pending registration found for this email' });
    }

    if (storedData.codeExpiresAt < Date.now()) {
      tempStore.delete(sanitizedEmail);
      return res.status(400).json({ message: 'Code expired. Please re-register.' });
    }

    if (String(storedData.verificationCode).trim() !== String(code).trim()) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    const alreadyExists = await User.findOne({ email: storedData.email });
    if (alreadyExists) {
      tempStore.delete(sanitizedEmail);
      return res.status(400).json({ message: 'Email already verified. Please log in.' });
    }

    const newUser = new User({
      name: storedData.name,
      email: storedData.email,
      age: storedData.age,
      contactno: storedData.contactno,
      password: storedData.password,
      isVerified: true
    });

    await newUser.save();
    tempStore.delete(sanitizedEmail);
    res.status(201).json({ message: 'Account created and verified successfully.' });

  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const sanitizedEmail = email?.toLowerCase().trim();

    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, message: 'Login successful', user });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Request password reset code
const changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const sanitizedEmail = email?.toLowerCase().trim();

    if (!sanitizedEmail || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    tempStore.set(sanitizedEmail, {
      hashedPassword,
      resetCode,
      codeExpiresAt
    });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: sanitizedEmail,
      subject: 'Password Reset Code',
      text: `Your password reset code is ${resetCode}. It expires in 30 minutes.`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Verification code sent to email.' });
  } catch (err) {
    console.error('Error initiating password reset:', err);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

// Verify code and reset password (NO EMAIL REQUIRED in req.body)
const verifyResetCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Code is required' });

    let matchedEmail = null;
    for (const [email, data] of tempStore.entries()) {
      if (data.resetCode === code) {
        matchedEmail = email;
        break;
      }
    }

    if (!matchedEmail) {
      return res.status(404).json({ message: 'Invalid or expired reset code' });
    }

    const { codeExpiresAt, hashedPassword } = tempStore.get(matchedEmail);

    if (codeExpiresAt < Date.now()) {
      tempStore.delete(matchedEmail);
      return res.status(400).json({ message: 'Code expired. Please try again.' });
    }

    const user = await User.findOne({ email: matchedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = hashedPassword;
    await user.save();

    tempStore.delete(matchedEmail);
    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Error verifying reset code:', err);
    res.status(500).json({ message: 'Server error during reset verification' });
  }
};

module.exports = {
  requestVerificationCode,
  verifyEmailCode,
  loginUser,
  changePassword,
  verifyResetCode
};

