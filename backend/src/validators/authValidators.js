const { body } = require('express-validator');
exports.register = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Full name is required (2-100 characters)'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('confirmPassword').custom((v, { req }) => v === req.body.password).withMessage('Passwords do not match'),
  body('studentId').trim().notEmpty().withMessage('Student ID is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('year').isInt({ min: 1, max: 6 }).withMessage('Year must be between 1 and 6'),
  body('phone').trim().matches(/^[0-9+\-\s]{7,15}$/).withMessage('Valid phone number is required'),
];
exports.login = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];
