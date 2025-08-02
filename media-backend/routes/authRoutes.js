const express = require('express');
const router = express.Router();
const { validateRegisterUser, validateLoginUser, validateVerifyCode } = require('../middleware/authMiddleware');
const { validationResult } = require('express-validator');

const {
  requestVerificationCode,
  verifyEmailCode,
  loginUser,
  changePassword,
  verifyResetCode
} = require('../controllers/authController');


// code for verification via email
router.post('/request-code', validateRegisterUser, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  requestVerificationCode(req, res);
});

//code verification
router.post('/verify-code',validateVerifyCode, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())  {
    return res.status(422).json({ errors: errors.array() });
  }
  verifyEmailCode(req, res);
});

//log in after account creation
router.post('/login', validateLoginUser, (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    loginUser(req, res);
});

router.post('/change-password', changePassword);


router.post('/verify-reset-code', verifyResetCode);

module.exports = router;