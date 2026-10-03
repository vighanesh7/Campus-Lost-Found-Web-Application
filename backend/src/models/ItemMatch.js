module.exports = (sequelize, DataTypes) => sequelize.define('ItemMatch', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  lostItemId: { type: DataTypes.INTEGER, allowNull: false },
  foundItemId: { type: DataTypes.INTEGER, allowNull: false },
  score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'item_matches', updatedAt: false, indexes: [{ unique: true, fields: ['lostItemId', 'foundItemId'] }] });
