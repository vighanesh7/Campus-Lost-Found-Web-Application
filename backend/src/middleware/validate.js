const { validationResult } = require('express-validator');
const { removeFile } = require('../utils/fileUtils');
// Runs after express-validator chains; cleans up uploaded file if invalid.
module.exports = async (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  if (req.file) await removeFile(req.file.path);
  return res.status(422).json({
    success: false, message: 'Validation failed',
    errors: result.array().map((e) => ({ field: e.path, message: e.msg })),
  });
};
