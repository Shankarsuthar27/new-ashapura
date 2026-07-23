'use strict';

const { body, validationResult } = require('express-validator');

// ── Shared validation error responder ────────────────────────────────────────
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validation failed.',
      details: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Must be a valid email address.')
    .normalizeEmail(),
  handleValidationErrors,
];

// ── POST /api/auth/verify-otp ────────────────────────────────────────────────
const validateVerifyOtp = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Must be a valid email address.')
    .normalizeEmail(),
  body('otp')
    .trim()
    .notEmpty().withMessage('OTP is required.')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits.')
    .isNumeric().withMessage('OTP must contain only digits.'),
  handleValidationErrors,
];

// ── POST /api/auth/reset-password ────────────────────────────────────────────
const validateResetPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Must be a valid email address.')
    .normalizeEmail(),
  body('reset_token')
    .trim()
    .notEmpty().withMessage('Reset token is required.')
    .isLength({ min: 64, max: 64 }).withMessage('Invalid reset token format.'),
  body('new_password')
    .notEmpty().withMessage('New password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.'),
  handleValidationErrors,
];

module.exports = { validateForgotPassword, validateVerifyOtp, validateResetPassword };
