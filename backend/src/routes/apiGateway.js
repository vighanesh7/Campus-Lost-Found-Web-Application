// "API gateway": one place that registers every API module under /api.
const router = require('express').Router();
const modules = {
  '/auth': require('./authRoutes'),
  '/users': require('./userRoutes'),
  '/items': require('./itemRoutes'),
  '/categories': require('./categoryRoutes'),
  '/reports': require('./reportRoutes'),
  '/favorites': require('./favoriteRoutes'),
  '/messages': require('./messageRoutes'),
  '/notifications': require('./notificationRoutes'),
  '/matches': require('./matchRoutes'),
  '/admin': require('./adminRoutes'),
};
router.get('/health', (req, res) => res.json({ success: true, message: 'API is running', data: { time: new Date().toISOString() } }));
Object.entries(modules).forEach(([prefix, r]) => router.use(prefix, r));
module.exports = router;
