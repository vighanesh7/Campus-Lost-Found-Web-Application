'use strict';
// Creates the "reports" table.
module.exports = {
  async up(queryInterface, Sequelize) {
    const S = Sequelize;
    await queryInterface.createTable('reports', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      itemId: { type: S.INTEGER, allowNull: false, references: { model: 'items', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      reportedBy: { type: S.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      reportType: { type: S.ENUM('INAPPROPRIATE','SPAM','DUPLICATE','FALSE_CLAIM','OTHER'), allowNull: false },
      reason: { type: S.TEXT, allowNull: false },
      status: { type: S.ENUM('PENDING','REVIEWED','APPROVED','REJECTED','RESOLVED'), allowNull: false, defaultValue: 'PENDING' },
      adminNotes: { type: S.TEXT },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: S.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    
  },
  async down(queryInterface) {
    await queryInterface.dropTable('reports');
  },
};
