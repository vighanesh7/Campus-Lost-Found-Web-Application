module.exports = (sequelize, DataTypes) => sequelize.define('ItemImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  itemId: { type: DataTypes.INTEGER, allowNull: false },
  imagePath: { type: DataTypes.STRING(255), allowNull: false },
  isPrimary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, { tableName: 'item_images', updatedAt: false });
