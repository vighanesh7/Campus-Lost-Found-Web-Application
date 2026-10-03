// Demonstrates reading request headers. Authorization is never logged.
const { appendLog } = require('../utils/fileUtils');
module.exports = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const line = [
      new Date().toISOString(), req.method, req.originalUrl, res.statusCode,
      `${Date.now() - start}ms`, `ct=${req.headers['content-type'] || '-'}`,
      `ua=${(req.headers['user-agent'] || '-').slice(0, 60)}`,
    ].join(' | ');
    appendLog(line).catch(() => {});
  });
  next();
};
