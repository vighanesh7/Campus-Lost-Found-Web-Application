'use strict';
// Creates the "conversations" table.
module.exports = {
  async up(queryInterface, Sequelize) {
    const S = Sequelize;
    await queryInterface.createTable('conversations', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      itemId: { type: S.INTEGER, allowNull: true, references: { model: 'items', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    
  },
  async down(queryInterface) {
    await queryInterface.dropTable('conversations');
  },
};
