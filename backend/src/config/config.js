// Used by sequelize-cli (migrations/seeders) AND by the app. Values come from .env
require('dotenv').config();
const base = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'campus_lost_found',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
};
module.exports = {
  development: { ...base, logging: false },
  test: { ...base, database: `${base.database}_test`, logging: false },
  production: { ...base, logging: false },
};
