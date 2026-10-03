const router = require('express').Router();
const c = require('../controllers/authController');
const v = require('../validators/authValidators');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', v.register, validate, c.register);
router.post('/login', v.login, validate, c.login);
router.post('/logout', protect, c.logout);
router.get('/me', protect, c.me);
module.exports = router;
