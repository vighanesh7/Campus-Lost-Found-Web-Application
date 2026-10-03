'use strict';
// Creates the "audit_logs" table.
module.exports = {
  async up(queryInterface, Sequelize) {
    const S = Sequelize;
    await queryInterface.createTable('audit_logs', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      userId: { type: S.INTEGER, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      action: { type: S.STRING(80), allowNull: false },
      entity: { type: S.STRING(50), allowNull: false },
      entityId: { type: S.INTEGER },
      details: { type: S.TEXT },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    
  },
  async down(queryInterface) {
    await queryInterface.dropTable('audit_logs');
  },
};
