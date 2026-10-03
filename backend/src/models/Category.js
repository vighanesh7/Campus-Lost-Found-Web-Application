module.exports = (sequelize, DataTypes) => sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(60), allowNull: false, unique: true },
  description: { type: DataTypes.STRING(255) },
}, { tableName: 'categories' });
