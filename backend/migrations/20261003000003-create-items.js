'use strict';
// Creates the "items" table.
module.exports = {
  async up(queryInterface, Sequelize) {
    const S = Sequelize;
    await queryInterface.createTable('items', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      userId: { type: S.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      categoryId: { type: S.INTEGER, allowNull: false, references: { model: 'categories', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
      type: { type: S.ENUM('LOST','FOUND'), allowNull: false },
      name: { type: S.STRING(120), allowNull: false },
      description: { type: S.TEXT, allowNull: false },
      location: { type: S.STRING(150), allowNull: false },
      date: { type: S.DATEONLY, allowNull: false },
      time: { type: S.TIME },
      status: { type: S.ENUM('ACTIVE','PENDING','MATCHED','RETURNED','RESOLVED','CLOSED'), allowNull: false, defaultValue: 'ACTIVE' },
      image: { type: S.STRING(255) },
      additionalDetails: { type: S.TEXT },
      contactPreference: { type: S.ENUM('MESSAGE','EMAIL','PHONE'), allowNull: false, defaultValue: 'MESSAGE' },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('items', ['type', 'status']);
    await queryInterface.addIndex('items', ['categoryId']);
    await queryInterface.addIndex('items', ['location']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('items');
  },
};
