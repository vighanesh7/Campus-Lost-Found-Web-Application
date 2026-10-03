const router = require('express').Router();
const c = require('../controllers/itemController');
const v = require('../validators/itemValidators');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.use(protect);
router.get('/', c.list);
router.get('/mine', c.mine);          // must come before '/:id'
router.get('/stats', c.stats);
router.get('/:id', v.id, validate, c.get);
// multer runs first so multipart fields are parsed before validation
router.post('/', upload.single('image'), v.create, validate, c.create);
router.put('/:id', upload.single('image'), v.update, validate, c.update);
router.patch('/:id/status', v.status, validate, c.changeStatus);
router.delete('/:id', v.id, validate, c.remove);
module.exports = router;
