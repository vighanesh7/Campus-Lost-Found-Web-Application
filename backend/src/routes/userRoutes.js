const router = require('express').Router();
const { body, param } = require('express-validator');
const c = require('../controllers/userController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
router.use(protect);
router.get('/profile', c.profile);
router.put('/profile', upload.single('profileImage'), [
  body('name').optional({ checkFalsy: true }).trim().isLength({ min: 2, max: 100 }),
  body('department').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('year').optional({ checkFalsy: true }).isInt({ min: 1, max: 6 }),
  body('phone').optional({ checkFalsy: true }).matches(/^[0-9+\-\s]{7,15}$/).withMessage('Valid phone number is required'),
], validate, c.update);
router.get('/:id', param('id').isInt(), validate, c.getPublic);
module.exports = router;
