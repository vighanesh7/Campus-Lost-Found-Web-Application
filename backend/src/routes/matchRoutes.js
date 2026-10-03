const router = require('express').Router();
const { Op } = require('sequelize');
const { param } = require('express-validator');
const { ItemMatch, Item } = require('../models');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const itemService = require('../services/itemService');
const { sendSuccess } = require('../utils/apiResponse');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
// Possible matches for one of the user's items (admins may view any).
router.get('/item/:id', param('id').isInt(), validate, asyncHandler(async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (!item) throw ApiError.notFound('Item not found');
  if (item.userId !== req.user.id && req.user.role !== 'ADMIN') throw ApiError.forbidden();
  const rows = await ItemMatch.findAll({
    where: { [Op.or]: [{ lostItemId: item.id }, { foundItemId: item.id }] }, order: [['score', 'DESC']],
    include: [{ model: Item, as: 'lostItem', include: itemService.buildIncludes() }, { model: Item, as: 'foundItem', include: itemService.buildIncludes() }],
  });
  sendSuccess(res, { matches: rows.map((m) => ({ id: m.id, score: m.score, item: item.type === 'LOST' ? m.foundItem : m.lostItem })) });
}));
module.exports = router;
