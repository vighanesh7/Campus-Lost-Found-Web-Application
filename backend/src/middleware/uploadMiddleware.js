const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { uploadDir } = require('../utils/fileUtils');

const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ALLOWED[file.mimetype]}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) =>
    ALLOWED[file.mimetype] ? cb(null, true) : cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only JPG, PNG or WEBP images allowed')),
});
module.exports = { upload, publicPath: (file) => `/uploads/${path.basename(file.filename)}` };
