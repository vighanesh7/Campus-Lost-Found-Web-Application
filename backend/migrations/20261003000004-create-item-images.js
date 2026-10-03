'use strict';
// Creates the "item_images" table.
module.exports = {
  async up(queryInterface, Sequelize) {
    const S = Sequelize;
    await queryInterface.createTable('item_images', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      itemId: { type: S.INTEGER, allowNull: false, references: { model: 'items', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      imagePath: { type: S.STRING(255), allowNull: false },
      isPrimary: { type: S.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    
  },
  async down(queryInterface) {
    await queryInterface.dropTable('item_images');
  },
};
