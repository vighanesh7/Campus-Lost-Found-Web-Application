module.exports = (sequelize, DataTypes) => sequelize.define('Favorite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  itemId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'favorites', updatedAt: false, indexes: [{ unique: true, fields: ['userId', 'itemId'] }] });
