require('dotenv').config();
const required = ['JWT_SECRET'];
required.forEach((k) => { if (!process.env[k]) throw new Error(`Missing env variable: ${k}`); });
module.exports = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
