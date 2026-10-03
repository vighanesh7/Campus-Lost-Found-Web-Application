'use strict';
// Creates the "categories" table.
module.exports = {
  async up(queryInterface, Sequelize) {
    const S = Sequelize;
    await queryInterface.createTable('categories', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: S.STRING(60), allowNull: false, unique: true },
      description: { type: S.STRING(255) },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    
  },
  async down(queryInterface) {
    await queryInterface.dropTable('categories');
  },
};
