const TYPES = ['ITEM_REPORTED', 'MATCH_FOUND', 'MESSAGE', 'STATUS_CHANGE', 'ITEM_RESOLVED', 'ADMIN_ACTION', 'REMINDER'];
const model = (sequelize, DataTypes) => sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM(...TYPES), allowNull: false },
  title: { type: DataTypes.STRING(150), allowNull: false },
  message: { type: DataTypes.STRING(500), allowNull: false },
  relatedItemId: { type: DataTypes.INTEGER, allowNull: true },
  isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, { tableName: 'notifications', updatedAt: false });
module.exports = model;
module.exports.TYPES = TYPES;
