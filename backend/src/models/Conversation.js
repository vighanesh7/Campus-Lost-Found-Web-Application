module.exports = (sequelize, DataTypes) => sequelize.define('Conversation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  itemId: { type: DataTypes.INTEGER, allowNull: true },   // item the chat is about
}, { tableName: 'conversations' });
