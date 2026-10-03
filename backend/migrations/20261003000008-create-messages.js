'use strict';
// Creates the "messages" table.
module.exports = {
  async up(queryInterface, Sequelize) {
    const S = Sequelize;
    await queryInterface.createTable('messages', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      conversationId: { type: S.INTEGER, allowNull: false, references: { model: 'conversations', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      senderId: { type: S.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      message: { type: S.TEXT, allowNull: false },
      readAt: { type: S.DATE, allowNull: true },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    
  },
  async down(queryInterface) {
    await queryInterface.dropTable('messages');
  },
};
