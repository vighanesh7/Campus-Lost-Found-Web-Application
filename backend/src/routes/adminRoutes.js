const router = require('express').Router();
const { body, param } = require('express-validator');
const svc = require('../services/adminService');
const itemService = require('../services/itemService');
const { sendCsv } = require('../utils/csvStream');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.use(protect, adminOnly);   // every route below is admin-only (checked on the server)
router.get('/stats', asyncHandler(async (req, res) => sendSuccess(res, await svc.dashboard())));
router.get('/users', asyncHandler(async (req, res) => sendSuccess(res, await svc.listUsers(req.query))));
router.put('/users/:id/role', param('id').isInt(), body('role').isIn(['STUDENT', 'ADMIN']), validate,
  asyncHandler(async (req, res) => sendSuccess(res, { user: await svc.updateUserRole(req.user, req.params.id, req.body.role) }, 'Role updated')));
router.delete('/users/:id', param('id').isInt(), validate,
  asyncHandler(async (req, res) => { await svc.deleteUser(req.user, req.params.id); sendSuccess(res, {}, 'User deleted'); }));
router.get('/items', asyncHandler(async (req, res) => sendSuccess(res, await itemService.list(req.query))));
router.delete('/items/:id', param('id').isInt(), validate,
  asyncHandler(async (req, res) => { await svc.deleteItem(req.user, req.params.id); sendSuccess(res, {}, 'Item removed'); }));
// Streamed CSV downloads
router.get('/export/:name', asyncHandler(async (req, res) => {
  const entry = svc.exportModels[req.params.name];
  if (!entry) throw ApiError.notFound('Unknown export');
  await sendCsv(res, `${req.params.name}.csv`, entry[0], entry[1]);
}));
module.exports = router;
