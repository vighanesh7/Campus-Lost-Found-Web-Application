const svc = require('../services/reportService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
exports.create = asyncHandler(async (req, res) => sendSuccess(res, { report: await svc.create(req.user, req.body) }, 'Report submitted', 201));
exports.list = asyncHandler(async (req, res) => sendSuccess(res, await svc.list(req.user, req.query)));
exports.update = asyncHandler(async (req, res) => sendSuccess(res, { report: await svc.update(req.params.id, req.user, req.body) }, 'Report updated'));
