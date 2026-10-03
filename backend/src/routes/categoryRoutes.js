const router = require('express').Router();
const { body, param } = require('express-validator');
const { Category } = require('../models');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

const rules = [body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2-60 characters'),
  body('description').optional().isLength({ max: 255 })];

router.get('/', asyncHandler(async (req, res) =>
  sendSuccess(res, { categories: await Category.findAll({ order: [['name', 'ASC']] }) })));
router.post('/', protect, adminOnly, rules, validate, asyncHandler(async (req, res) =>
  sendSuccess(res, { category: await Category.create({ name: req.body.name, description: req.body.description }) }, 'Category created', 201)));
router.put('/:id', protect, adminOnly, param('id').isInt(), rules, validate, asyncHandler(async (req, res) => {
  const cat = await Category.findByPk(req.params.id);
  if (!cat) throw ApiError.notFound('Category not found');
  await cat.update({ name: req.body.name, description: req.body.description });
  sendSuccess(res, { category: cat }, 'Category updated');
}));
router.delete('/:id', protect, adminOnly, param('id').isInt(), validate, asyncHandler(async (req, res) => {
  const cat = await Category.findByPk(req.params.id);
  if (!cat) throw ApiError.notFound('Category not found');
  await cat.destroy();   // RESTRICT FK blocks deletion if items use it -> mapped to 400 by errorMiddleware
  sendSuccess(res, {}, 'Category deleted');
}));
module.exports = router;
