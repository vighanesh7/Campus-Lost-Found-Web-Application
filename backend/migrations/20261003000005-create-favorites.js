'use strict';
// Creates the "favorites" table.
module.exports = {
  async up(queryInterface, Sequelize) {
    const S = Sequelize;
    await queryInterface.createTable('favorites', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      userId: { type: S.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      itemId: { type: S.INTEGER, allowNull: false, references: { model: 'items', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('favorites', { fields: ['userId', 'itemId'], type: 'unique', name: 'uq_favorites_user_item' });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('favorites');
  },
};
