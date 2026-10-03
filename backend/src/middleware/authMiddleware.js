const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Reads "Authorization: Bearer <token>", verifies it, loads the user.
exports.protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) throw ApiError.unauthorized();
  const payload = jwt.verify(header.slice(7), jwtSecret); // throws on invalid/expired
  const user = await User.findByPk(payload.id);
  if (!user) throw ApiError.unauthorized('User no longer exists');
  req.user = user;
  next();
});
