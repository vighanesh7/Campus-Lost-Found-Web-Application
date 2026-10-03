const itemService = require('../services/itemService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => sendSuccess(res, await itemService.list(req.query)));
exports.mine = asyncHandler(async (req, res) => sendSuccess(res, await itemService.list(req.query, { userId: req.user.id })));
exports.stats = asyncHandler(async (req, res) => sendSuccess(res, await itemService.homeStats(req.user.id)));
exports.get = asyncHandler(async (req, res) => sendSuccess(res, { item: await itemService.getById(req.params.id) }));
exports.create = asyncHandler(async (req, res) =>
  sendSuccess(res, { item: await itemService.create(req.user, req.body, req.file) }, 'Item created successfully', 201));
exports.update = asyncHandler(async (req, res) =>
  sendSuccess(res, { item: await itemService.update(req.params.id, req.user, req.body, req.file) }, 'Item updated successfully'));
exports.changeStatus = asyncHandler(async (req, res) =>
  sendSuccess(res, { item: await itemService.changeStatus(req.params.id, req.user, req.body.status) }, 'Status updated'));
exports.remove = asyncHandler(async (req, res) => {
  await itemService.remove(req.params.id, req.user);
  sendSuccess(res, {}, 'Item deleted successfully');
});
