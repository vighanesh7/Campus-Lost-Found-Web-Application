module.exports = (sequelize, DataTypes) => sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  conversationId: { type: DataTypes.INTEGER, allowNull: false },
  senderId: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false, validate: { len: [1, 2000] } },
  readAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'messages', updatedAt: false });
