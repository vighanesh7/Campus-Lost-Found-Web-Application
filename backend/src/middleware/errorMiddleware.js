const multer = require('multer');
const { nodeEnv } = require('../config/env');

exports.notFound = (req, res) =>
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });

// Central error handler: maps known errors to safe messages; never leaks DB internals.
exports.errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  let status = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'Something went wrong on the server';
  let errors = err.errors || [];

  if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    const field = err.errors?.[0]?.path || 'value';
    message = `${field} is already in use`;
  } else if (err.name === 'SequelizeValidationError') {
    status = 422; message = 'Validation failed';
    errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    status = 400; message = 'This action is not allowed: the record is linked to other data or references something that does not exist';
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401; message = 'Invalid or expired token';
  } else if (err instanceof multer.MulterError) {
    status = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5MB or smaller'
      : (err.field || 'File upload error');
  }
  if (status === 500) console.error(err);
  res.status(status).json({
    success: false, message, errors,
    ...(nodeEnv === 'development' && status === 500 ? { debug: err.message } : {}),
  });
};
