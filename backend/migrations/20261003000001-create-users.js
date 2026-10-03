'use strict';
// Creates the "users" table.
module.exports = {
  async up(queryInterface, Sequelize) {
    const S = Sequelize;
    await queryInterface.createTable('users', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: S.STRING(100), allowNull: false },
      email: { type: S.STRING(150), allowNull: false, unique: true },
      password: { type: S.STRING(255), allowNull: false },
      studentId: { type: S.STRING(30), allowNull: false, unique: true },
      department: { type: S.STRING(100) },
      year: { type: S.INTEGER },
      phone: { type: S.STRING(20) },
      profileImage: { type: S.STRING(255) },
      role: { type: S.ENUM('STUDENT','ADMIN'), allowNull: false, defaultValue: 'STUDENT' },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    
  },
  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
