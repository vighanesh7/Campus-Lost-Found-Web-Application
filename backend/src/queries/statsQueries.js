// Raw SQL via sequelize.query() with bind/replacement parameters (CSA-301 syllabus).
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

exports.itemTotals = async () => {
  const [row] = await sequelize.query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(type = 'LOST'), 0) AS lost,
            COALESCE(SUM(type = 'FOUND'), 0) AS found,
            COALESCE(SUM(status IN ('RESOLVED','RETURNED')), 0) AS resolved
       FROM items`, { type: QueryTypes.SELECT });
  return { total: +row.total, lost: +row.lost, found: +row.found, resolved: +row.resolved };
};

exports.userPendingCount = async (userId) => {
  const [row] = await sequelize.query(
    `SELECT COUNT(*) AS pending FROM items WHERE userId = :userId AND status IN ('PENDING','MATCHED')`,
    { replacements: { userId }, type: QueryTypes.SELECT });
  return +row.pending;
};

exports.topCategories = (limit = 5) => sequelize.query(
  `SELECT c.name, COUNT(i.id) AS count FROM categories c
     LEFT JOIN items i ON i.categoryId = c.id GROUP BY c.id, c.name ORDER BY count DESC LIMIT :limit`,
  { replacements: { limit: Number(limit) }, type: QueryTypes.SELECT });

exports.commonLocations = (limit = 5) => sequelize.query(
  `SELECT location, COUNT(*) AS count FROM items WHERE type = 'LOST'
     GROUP BY location ORDER BY count DESC LIMIT :limit`,
  { replacements: { limit: Number(limit) }, type: QueryTypes.SELECT });

exports.reportsPerMonth = () => sequelize.query(
  `SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, COUNT(*) AS count FROM reports
     GROUP BY month ORDER BY month DESC LIMIT 12`, { type: QueryTypes.SELECT });

exports.userCount = async () => {
  const [row] = await sequelize.query('SELECT COUNT(*) AS total FROM users', { type: QueryTypes.SELECT });
  return +row.total;
};
exports.reportStatusCounts = async () => {
  const rows = await sequelize.query('SELECT status, COUNT(*) AS count FROM reports GROUP BY status', { type: QueryTypes.SELECT });
  return rows.reduce((acc, r) => ({ ...acc, [r.status]: +r.count }), { PENDING: 0, REVIEWED: 0, APPROVED: 0, REJECTED: 0, RESOLVED: 0 });
};
