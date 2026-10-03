'use strict';
// Creates the "notifications" table.
module.exports = {
  async up(queryInterface, Sequelize) {
    const S = Sequelize;
    await queryInterface.createTable('notifications', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      userId: { type: S.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      type: { type: S.ENUM('ITEM_REPORTED','MATCH_FOUND','MESSAGE','STATUS_CHANGE','ITEM_RESOLVED','ADMIN_ACTION','REMINDER'), allowNull: false },
      title: { type: S.STRING(150), allowNull: false },
      message: { type: S.STRING(500), allowNull: false },
      relatedItemId: { type: S.INTEGER, allowNull: true, references: { model: 'items', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      isRead: { type: S.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    
  },
  async down(queryInterface) {
    await queryInterface.dropTable('notifications');
  },
};
