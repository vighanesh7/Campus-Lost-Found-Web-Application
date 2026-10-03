'use strict';
// Creates the "item_matches" table.
module.exports = {
  async up(queryInterface, Sequelize) {
    const S = Sequelize;
    await queryInterface.createTable('item_matches', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      lostItemId: { type: S.INTEGER, allowNull: false, references: { model: 'items', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      foundItemId: { type: S.INTEGER, allowNull: false, references: { model: 'items', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      score: { type: S.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('item_matches', { fields: ['lostItemId', 'foundItemId'], type: 'unique', name: 'uq_match_pair' });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('item_matches');
  },
};
