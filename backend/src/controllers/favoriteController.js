const svc = require('../services/favoriteService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
exports.list = asyncHandler(async (req, res) => sendSuccess(res, { favorites: await svc.list(req.user.id) }));
exports.add = asyncHandler(async (req, res) => sendSuccess(res, { favorite: await svc.add(req.user.id, req.params.itemId) }, 'Saved to favourites', 201));
exports.remove = asyncHandler(async (req, res) => { await svc.remove(req.user.id, req.params.itemId); sendSuccess(res, {}, 'Removed from favourites'); });
