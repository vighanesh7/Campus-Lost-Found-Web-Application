const STATUSES = ['PENDING', 'REVIEWED', 'APPROVED', 'REJECTED', 'RESOLVED'];
const model = (sequelize, DataTypes) => sequelize.define('Report', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  itemId: { type: DataTypes.INTEGER, allowNull: false },
  reportedBy: { type: DataTypes.INTEGER, allowNull: false },
  reportType: { type: DataTypes.ENUM('INAPPROPRIATE', 'SPAM', 'DUPLICATE', 'FALSE_CLAIM', 'OTHER'), allowNull: false },
  reason: { type: DataTypes.TEXT, allowNull: false, validate: { len: [5, 1000] } },
  status: { type: DataTypes.ENUM(...STATUSES), allowNull: false, defaultValue: 'PENDING' },
  adminNotes: { type: DataTypes.TEXT },
}, { tableName: 'reports' });
module.exports = model;
module.exports.STATUSES = STATUSES;
