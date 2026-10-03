const { Notification } = require('../models');
exports.create = ({ userId, type, title, message, relatedItemId = null }) =>
  Notification.create({ userId, type, title, message, relatedItemId });

const { User, Item } = require('../models');
const ApiError = require('../utils/ApiError');

exports.notifyAdmins = async ({ type, title, message, relatedItemId }) => {
  const admins = await User.findAll({ where: { role: 'ADMIN' }, attributes: ['id'] });
  await Promise.all(admins.map((a) => exports.create({ userId: a.id, type, title, message, relatedItemId })));
};
// Splits notifications into Today / Earlier as in the Figma design.
exports.listForUser = async (userId) => {
  const rows = await Notification.findAll({
    where: { userId }, order: [['createdAt', 'DESC']], limit: 100,
    include: [{ model: Item, as: 'item', attributes: ['id', 'name'] }],
  });
  const start = new Date(); start.setHours(0, 0, 0, 0);
  return {
    today: rows.filter((n) => n.createdAt >= start),
    earlier: rows.filter((n) => n.createdAt < start),
    unreadCount: rows.filter((n) => !n.isRead).length,
  };
};
exports.markRead = async (id, userId) => {
  const n = await Notification.findOne({ where: { id, userId } });
  if (!n) throw ApiError.notFound('Notification not found');
  return n.update({ isRead: true });
};
exports.markAllRead = (userId) => Notification.update({ isRead: true }, { where: { userId, isRead: false } });
