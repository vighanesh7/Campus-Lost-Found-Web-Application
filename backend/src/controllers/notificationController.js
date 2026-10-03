const svc = require('../services/notificationService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
exports.list = asyncHandler(async (req, res) => sendSuccess(res, await svc.listForUser(req.user.id)));
exports.markRead = asyncHandler(async (req, res) => sendSuccess(res, { notification: await svc.markRead(req.params.id, req.user.id) }, 'Marked as read'));
exports.markAllRead = asyncHandler(async (req, res) => { await svc.markAllRead(req.user.id); sendSuccess(res, {}, 'All notifications marked as read'); });
