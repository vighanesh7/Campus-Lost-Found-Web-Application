const { AuditLog } = require('../models');
exports.log = (userId, action, entity, entityId, details = null) =>
  AuditLog.create({ userId, action, entity, entityId, details }).catch((e) => console.error('audit failed', e.message));
