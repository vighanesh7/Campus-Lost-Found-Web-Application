const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.register = asyncHandler(async (req, res) =>
  sendSuccess(res, await authService.register(req.body), 'Registration successful', 201));
exports.login = asyncHandler(async (req, res) =>
  sendSuccess(res, await authService.login(req.body), 'Login successful'));
exports.me = asyncHandler(async (req, res) => sendSuccess(res, { user: req.user }, 'Current user'));
// JWT is stateless: logout = client discards the token.
exports.logout = (req, res) => sendSuccess(res, {}, 'Logged out');
