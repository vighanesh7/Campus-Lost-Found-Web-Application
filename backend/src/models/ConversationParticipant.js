module.exports = (sequelize, DataTypes) => sequelize.define('ConversationParticipant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  conversationId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'conversation_participants', updatedAt: false, indexes: [{ unique: true, fields: ['conversationId', 'userId'] }] });
