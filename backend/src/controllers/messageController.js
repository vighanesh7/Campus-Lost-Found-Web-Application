const svc = require('../services/messageService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
exports.list = asyncHandler(async (req, res) => sendSuccess(res, { conversations: await svc.listConversations(req.user.id) }));
exports.get = asyncHandler(async (req, res) => sendSuccess(res, await svc.getConversation(req.user.id, req.params.conversationId)));
exports.send = asyncHandler(async (req, res) => sendSuccess(res, await svc.send(req.user, req.body), 'Message sent', 201));
exports.markRead = asyncHandler(async (req, res) => sendSuccess(res, { message: await svc.markRead(req.user.id, req.params.id) }, 'Marked as read'));
