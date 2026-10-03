const { Op } = require('sequelize');
const { User, Report, Item } = require('../models');
const ApiError = require('../utils/ApiError');
const stats = require('../queries/statsQueries');
const auditService = require('./auditService');
const reportService = require('./reportService');

exports.dashboard = async () => {
  const [totals, users, reportCounts, topCategories, commonLocations, reportsPerMonth, recentReports] = await Promise.all([
    stats.itemTotals(), stats.userCount(), stats.reportStatusCounts(), stats.topCategories(), stats.commonLocations(), stats.reportsPerMonth(),
    reportService.list({ role: 'ADMIN' }, { limit: 5 }),
  ]);
  return { totals, users, reportCounts, topCategories, commonLocations, reportsPerMonth, recentReports: recentReports.reports };
};
exports.listUsers = async (q) => {
  const where = q.search ? { [Op.or]: [{ name: { [Op.like]: `%${q.search}%` } }, { email: { [Op.like]: `%${q.search}%` } }, { studentId: { [Op.like]: `%${q.search}%` } }] } : {};
  const page = Math.max(parseInt(q.page, 10) || 1, 1); const limit = Math.min(parseInt(q.limit, 10) || 10, 50);
  const { rows, count } = await User.findAndCountAll({ where, order: [['createdAt', 'DESC']], limit, offset: (page - 1) * limit });
  return { users: rows, currentPage: page, totalPages: Math.max(Math.ceil(count / limit), 1), totalItems: count };
};
exports.updateUserRole = async (admin, id, role) => {
  if (Number(id) === admin.id) throw ApiError.badRequest('You cannot change your own role');
  const user = await User.findByPk(id);
  if (!user) throw ApiError.notFound('User not found');
  await user.update({ role });
  await auditService.log(admin.id, 'USER_ROLE_CHANGED', 'User', user.id, `role=${role}`);
  return user;
};
exports.deleteUser = async (admin, id) => {
  if (Number(id) === admin.id) throw ApiError.badRequest('You cannot delete your own account');
  const user = await User.findByPk(id);
  if (!user) throw ApiError.notFound('User not found');
  await user.destroy();
  await auditService.log(admin.id, 'USER_DELETED', 'User', Number(id), user.email);
};
exports.deleteItem = async (admin, id) => {
  await require('./itemService').remove(id, admin);
  await auditService.log(admin.id, 'ITEM_DELETED', 'Item', Number(id));
};
exports.exportModels = { items: [Item, ['id', 'type', 'name', 'categoryId', 'location', 'date', 'status', 'userId', 'createdAt']],
  reports: [Report, ['id', 'itemId', 'reportedBy', 'reportType', 'reason', 'status', 'adminNotes', 'createdAt']] };
