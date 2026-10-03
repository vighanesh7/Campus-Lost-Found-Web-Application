const { body, param } = require('express-validator');
const { Category } = require('../models');
const { STATUSES } = require('../models/Item');

const notFuture = (v) => {
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) throw new Error('Valid date is required');
  if (d > new Date(Date.now() + 24 * 3600 * 1000)) throw new Error('Date cannot be in the future');
  return true;
};
const categoryExists = async (id) => { if (!(await Category.findByPk(id))) throw new Error('Category does not exist'); return true; };

const fields = (optional) => {
  const o = (c) => (optional ? c.optional() : c);
  return [
    o(body('name')).trim().isLength({ min: 2, max: 120 }).withMessage('Item name must be 2-120 characters'),
    o(body('categoryId')).isInt({ min: 1 }).withMessage('Category is required').bail().custom(categoryExists),
    o(body('description')).trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
    o(body('location')).trim().isLength({ min: 2, max: 150 }).withMessage('Location is required'),
    o(body('date')).custom(notFuture),
    body('time').optional({ checkFalsy: true }).matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/).withMessage('Time must be HH:MM'),
    body('contactPreference').optional().isIn(['MESSAGE', 'EMAIL', 'PHONE']).withMessage('Invalid contact preference'),
    body('additionalDetails').optional().isLength({ max: 1000 }).withMessage('Additional details too long'),
  ];
};
exports.create = [body('type').toUpperCase().isIn(['LOST', 'FOUND']).withMessage('Type must be LOST or FOUND'), ...fields(false)];
exports.update = [param('id').isInt(), ...fields(true)];
exports.status = [param('id').isInt(), body('status').toUpperCase().isIn(STATUSES).withMessage('Invalid status')];
exports.id = [param('id').isInt().withMessage('Invalid id')];
