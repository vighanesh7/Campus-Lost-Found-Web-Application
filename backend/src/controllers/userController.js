const svc = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
exports.profile = asyncHandler(async (req, res) => sendSuccess(res, await svc.profile(req.user.id)));
exports.update = asyncHandler(async (req, res) => sendSuccess(res, { user: await svc.updateProfile(req.user.id, req.body, req.file) }, 'Profile updated'));
exports.getPublic = asyncHandler(async (req, res) => sendSuccess(res, { user: await svc.getPublic(req.params.id) }));
