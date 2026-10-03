const { Op } = require('sequelize');
const { Item, ItemImage, Category, User } = require('../models');
const ApiError = require('../utils/ApiError');
const events = require('../events/appEvents');
const { removeFile, uploadDir } = require('../utils/fileUtils');
const path = require('path');
const statsQueries = require('../queries/statsQueries');

// Reporter contact details (email/phone) are deliberately NOT exposed: use messaging.
const includes = [
  { model: Category, as: 'category', attributes: ['id', 'name'] },
  { model: User, as: 'reporter', attributes: ['id', 'name', 'department'] },
  { model: ItemImage, as: 'images', attributes: ['id', 'imagePath', 'isPrimary'] },
];

exports.list = async (q, { userId } = {}) => {
  const where = {};
  if (userId) where.userId = userId;
  if (q.type) where.type = String(q.type).toUpperCase();
  if (q.status) where.status = String(q.status).toUpperCase();
  if (q.location) where.location = { [Op.like]: `%${q.location}%` };
  if (q.date) where.date = q.date;
  if (q.dateFrom || q.dateTo) where.date = { ...(q.dateFrom && { [Op.gte]: q.dateFrom }), ...(q.dateTo && { [Op.lte]: q.dateTo }) };
  if (q.search) {
    const like = { [Op.like]: `%${q.search}%` };
    where[Op.or] = [{ name: like }, { description: like }, { location: like }];
  }
  if (q.categoryId) where.categoryId = q.categoryId;

  const include = includes.map((i) => ({ ...i }));
  if (q.category && !q.categoryId) {                       // category by name, e.g. ?category=electronics
    include[0] = { ...include[0], where: { name: q.category }, required: true };
  }
  const page = Math.max(parseInt(q.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(q.limit, 10) || 12, 1), 50);

  const { rows, count } = await Item.findAndCountAll({
    where, include, distinct: true, order: [['createdAt', 'DESC']], limit, offset: (page - 1) * limit,
  });
  return { items: rows, currentPage: page, totalPages: Math.max(Math.ceil(count / limit), 1), totalItems: count };
};

exports.getById = async (id) => {
  const item = await Item.findByPk(id, { include: includes.map((i) => ({ ...i })) });
  if (!item) throw ApiError.notFound('Item not found');
  return item;
};

exports.create = async (user, data, file) => {
  const item = await Item.create({
    userId: user.id, categoryId: data.categoryId, type: data.type.toUpperCase(), name: data.name,
    description: data.description, location: data.location, date: data.date, time: data.time || null,
    additionalDetails: data.additionalDetails || null, contactPreference: data.contactPreference || 'MESSAGE',
    image: file ? `/uploads/${file.filename}` : null,
  });
  if (file) await ItemImage.create({ itemId: item.id, imagePath: item.image, isPrimary: true });
  events.emit('itemReported', item);                        // listeners: notify + match
  return exports.getById(item.id);
};

const assertCanModify = (item, user) => {
  if (item.userId !== user.id && user.role !== 'ADMIN') throw ApiError.forbidden('You can only modify your own items');
};
const EDITABLE = ['categoryId', 'name', 'description', 'location', 'date', 'time', 'additionalDetails', 'contactPreference'];

exports.update = async (id, user, data, file) => {
  const item = await exports.getById(id);
  assertCanModify(item, user);
  const changes = {};
  EDITABLE.forEach((f) => { if (data[f] !== undefined) changes[f] = data[f]; });
  if (file) { changes.image = `/uploads/${file.filename}`; await ItemImage.create({ itemId: item.id, imagePath: changes.image, isPrimary: true }); }
  await item.update(changes);
  return exports.getById(id);
};

const OWNER_STATUSES = ['ACTIVE', 'RETURNED', 'RESOLVED', 'CLOSED'];
exports.changeStatus = async (id, user, status) => {
  const item = await exports.getById(id);
  assertCanModify(item, user);
  if (user.role !== 'ADMIN' && !OWNER_STATUSES.includes(status)) throw ApiError.forbidden('Only admins can set this status');
  await item.update({ status });
  events.emit('itemStatusChanged', { item, by: user });
  if (['RESOLVED', 'RETURNED'].includes(status)) events.emit('itemResolved', item);
  return item;
};

exports.remove = async (id, user) => {
  const item = await exports.getById(id);
  assertCanModify(item, user);
  const paths = item.images.map((i) => i.imagePath);
  await item.destroy();                                     // item_images cascade
  await Promise.all(paths.map((p) => removeFile(path.join(uploadDir, path.basename(p)))));
};

exports.homeStats = async (userId) => {
  const [totals, pending] = await Promise.all([statsQueries.itemTotals(), statsQueries.userPendingCount(userId)]);
  return { ...totals, pending };
};
exports.buildIncludes = () => includes.map((i) => ({ ...i }));
