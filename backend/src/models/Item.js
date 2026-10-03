const TYPES = ['LOST', 'FOUND'];
const STATUSES = ['ACTIVE', 'PENDING', 'MATCHED', 'RETURNED', 'RESOLVED', 'CLOSED'];
const model = (sequelize, DataTypes) => sequelize.define('Item', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  categoryId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM(...TYPES), allowNull: false },
  name: { type: DataTypes.STRING(120), allowNull: false, validate: { len: [2, 120] } },
  description: { type: DataTypes.TEXT, allowNull: false, validate: { len: [10, 2000] } },
  location: { type: DataTypes.STRING(150), allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false, validate: { isDate: true } },
  time: { type: DataTypes.TIME },
  status: { type: DataTypes.ENUM(...STATUSES), allowNull: false, defaultValue: 'ACTIVE' },
  image: { type: DataTypes.STRING(255) },
  additionalDetails: { type: DataTypes.TEXT },
  contactPreference: { type: DataTypes.ENUM('MESSAGE', 'EMAIL', 'PHONE'), allowNull: false, defaultValue: 'MESSAGE' },
}, { tableName: 'items' });
module.exports = model;
module.exports.TYPES = TYPES;
module.exports.STATUSES = STATUSES;
