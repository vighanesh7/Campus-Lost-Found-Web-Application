// Consistent API envelope: { success, message, data }
const sendSuccess = (res, data = {}, message = 'OK', status = 200) =>
  res.status(status).json({ success: true, message, data });
module.exports = { sendSuccess };
