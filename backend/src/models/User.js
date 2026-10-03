module.exports = (sequelize, DataTypes) => sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, validate: { notEmpty: true } },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING(255), allowNull: false },
  studentId: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  department: { type: DataTypes.STRING(100) },
  year: { type: DataTypes.INTEGER, validate: { min: 1, max: 6 } },
  phone: { type: DataTypes.STRING(20) },
  profileImage: { type: DataTypes.STRING(255) },
  role: { type: DataTypes.ENUM('STUDENT', 'ADMIN'), allowNull: false, defaultValue: 'STUDENT' },
}, {
  tableName: 'users',
  defaultScope: { attributes: { exclude: ['password'] } },   // never return password hashes
  scopes: { withPassword: { attributes: { include: ['password'] } } },
});
