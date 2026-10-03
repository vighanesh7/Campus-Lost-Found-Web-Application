const { Report, Item, User } = require('../models');
const ApiError = require('../utils/ApiError');
const notificationService = require('./notificationService');
const auditService = require('./auditService');

const include = [
  { model: Item, as: 'item', attributes: ['id', 'name', 'type', 'status', 'userId', 'image'] },
  { model: User, as: 'reporter', attributes: ['id', 'name'] },
];
exports.create = async (user, { itemId, reportType, reason }) => {
  const item = await Item.findByPk(itemId);
  if (!item) throw ApiError.notFound('Item not found');
  if (await Report.findOne({ where: { itemId, reportedBy: user.id, status: 'PENDING' } }))
    throw ApiError.conflict('You already have a pending report for this item');
  const report = await Report.create({ itemId, reportedBy: user.id, reportType, reason });
  await notificationService.notifyAdmins({ type: 'ADMIN_ACTION', title: 'New report to review',
    message: `${user.name} reported "${item.name}" (${reportType}).`, relatedItemId: item.id });
  return report;
};
// Students see only their own reports; admins see all.
exports.list = async (user, q) => {
  const where = user.role === 'ADMIN' ? {} : { reportedBy: user.id };
  if (q.status) where.status = String(q.status).toUpperCase();
  const page = Math.max(parseInt(q.page, 10) || 1, 1);
  const limit = Math.min(parseInt(q.limit, 10) || 10, 50);
  const { rows, count } = await Report.findAndCountAll({ where, include, order: [['createdAt', 'DESC']], limit, offset: (page - 1) * limit });
  return { reports: rows, currentPage: page, totalPages: Math.max(Math.ceil(count / limit), 1), totalItems: count };
};
exports.update = async (id, admin, { status, adminNotes }) => {
  const report = await Report.findByPk(id, { include });
  if (!report) throw ApiError.notFound('Report not found');
  await report.update({ status, adminNotes: adminNotes ?? report.adminNotes });
  if (status === 'APPROVED' && report.item) await Item.update({ status: 'CLOSED' }, { where: { id: report.itemId } });
  await notificationService.create({ userId: report.reportedBy, type: 'STATUS_CHANGE', title: 'Your report was updated',
    message: `Your report on "${report.item?.name}" is now ${status}.`, relatedItemId: report.itemId });
  if (status === 'APPROVED' && report.item) await notificationService.create({ userId: report.item.userId, type: 'ADMIN_ACTION',
    title: 'Your item was closed by admin', message: `"${report.item.name}" was closed after a report was approved.`, relatedItemId: report.itemId });
  await auditService.log(admin.id, 'REPORT_UPDATED', 'Report', report.id, `status=${status}`);
  return report;
};
