import { check, validationResult } from 'express-validator';

// Common validation rules
const emailRules = [
  check('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail() // Sanitize: lowercase, remove dots from Gmail, etc.
];

const passwordRules = [
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
];

const usernameRules = [
  check('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be 3-20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
];

// Registration validation
export const validateRegister = [
  ...emailRules,
  ...passwordRules,
  ...usernameRules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((error) => ({
          field: error.param,
          message: error.msg
        }))
      });
    }
    next();
  }
];

// Login validation (less strict than registration)
export const validateLogin = [
  ...emailRules,
  check('password')
    .notEmpty()
    .withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((error) => ({
          field: error.param,
          message: error.msg
        }))
      });
    }
    next();
  }
];