const { body } = require('express-validator');
exports.send = [
  body('message').trim().isLength({ min: 1, max: 2000 }).withMessage('Message must be 1-2000 characters'),
  body('conversationId').optional().isInt(), body('recipientId').optional().isInt(), body('itemId').optional({ nullable: true }).isInt(),
  body().custom((b) => (b.conversationId || b.recipientId ? true : Promise.reject(new Error('conversationId or recipientId is required')))),
];
