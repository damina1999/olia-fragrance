const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register',
  [body('email').isEmail(), body('password').isLength({ min: 6 }), body('name').notEmpty()],
  ctrl.register
);
router.post('/login',
  [body('email').isEmail(), body('password').notEmpty()],
  ctrl.login
);
router.post('/verify-email', ctrl.verifyEmail);
router.post('/resend-otp', ctrl.resendOtp);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);

router.get('/me', protect, ctrl.getMe);
router.put('/me', protect, ctrl.updateMe);

module.exports = router;
