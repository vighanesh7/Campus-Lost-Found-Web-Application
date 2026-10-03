const ApiError = require('../utils/ApiError');
exports.authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next() : next(ApiError.forbidden());
exports.adminOnly = exports.authorize('ADMIN');
