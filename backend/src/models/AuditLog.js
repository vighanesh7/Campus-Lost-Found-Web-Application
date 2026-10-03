module.exports = (sequelize, DataTypes) => sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: true },
  action: { type: DataTypes.STRING(80), allowNull: false },
  entity: { type: DataTypes.STRING(50), allowNull: false },
  entityId: { type: DataTypes.INTEGER },
  details: { type: DataTypes.TEXT },
}, { tableName: 'audit_logs', updatedAt: false });
