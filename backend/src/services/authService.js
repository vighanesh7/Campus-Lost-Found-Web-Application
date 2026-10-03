const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const ApiError = require('../utils/ApiError');

const signToken = (user) => jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });
const publicUser = (user) => { const { password, ...rest } = user.toJSON(); return rest; };

exports.register = async ({ name, email, password, studentId, department, year, phone }) => {
  const passwordHash = await bcrypt.hash(password, 10);   // salted hash, never plain text
  // New accounts are always STUDENT; admins are created via seeder only.
  const user = await User.create({ name, email: email.toLowerCase(), password: passwordHash, studentId, department, year, phone, role: 'STUDENT' });
  return { user: publicUser(user), token: signToken(user) };
};

exports.login = async ({ email, password }) => {
  const user = await User.scope('withPassword').findOne({ where: { email: email.toLowerCase() } });
  // Same message for unknown email / wrong password: avoids account enumeration.
  if (!user || !(await bcrypt.compare(password, user.password))) throw ApiError.unauthorized('Invalid email or password');
  return { user: publicUser(user), token: signToken(user) };
};
