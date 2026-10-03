const { body, param } = require('express-validator');
const { STATUSES } = require('../models/Report');
exports.create = [
  body('itemId').isInt({ min: 1 }).withMessage('Item is required'),
  body('reportType').isIn(['INAPPROPRIATE', 'SPAM', 'DUPLICATE', 'FALSE_CLAIM', 'OTHER']).withMessage('Invalid report type'),
  body('reason').trim().isLength({ min: 5, max: 1000 }).withMessage('Reason must be 5-1000 characters'),
];
exports.update = [param('id').isInt(), body('status').toUpperCase().isIn(STATUSES).withMessage('Invalid status'),
  body('adminNotes').optional().isLength({ max: 1000 })];
