// Custom error carrying an HTTP status; caught by errorMiddleware.
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
  }
  static badRequest(m, e) { return new ApiError(400, m, e); }
  static unauthorized(m = 'Authentication required') { return new ApiError(401, m); }
  static forbidden(m = 'You do not have permission to do this') { return new ApiError(403, m); }
  static notFound(m = 'Resource not found') { return new ApiError(404, m); }
  static conflict(m) { return new ApiError(409, m); }
}
module.exports = ApiError;
