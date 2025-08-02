const { body } = require('express-validator');

const validateRegisterUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('age').isInt({ min: 13 }).withMessage('Age must be at least 13'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLoginUser = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const validateVerifyCode = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be exactly 6 digits')
];

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log('JWT verification error:', err.message);
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = {
  validateRegisterUser,
  validateLoginUser,
  validateVerifyCode,
  verifyToken
};