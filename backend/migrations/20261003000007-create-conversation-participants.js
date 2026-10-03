'use strict';
// Creates the "conversation_participants" table.
module.exports = {
  async up(queryInterface, Sequelize) {
    const S = Sequelize;
    await queryInterface.createTable('conversation_participants', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      conversationId: { type: S.INTEGER, allowNull: false, references: { model: 'conversations', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      userId: { type: S.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('conversation_participants', { fields: ['conversationId', 'userId'], type: 'unique', name: 'uq_participant' });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('conversation_participants');
  },
};
