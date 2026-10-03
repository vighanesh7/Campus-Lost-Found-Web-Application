const { User, Item } = require('../models');
const ApiError = require('../utils/ApiError');
const path = require('path');
const { removeFile, uploadDir } = require('../utils/fileUtils');

exports.profile = async (userId) => {
  const user = await User.findByPk(userId);
  const [lost, found, resolved] = await Promise.all([
    Item.count({ where: { userId, type: 'LOST' } }),
    Item.count({ where: { userId, type: 'FOUND' } }),
    Item.count({ where: { userId, status: ['RESOLVED', 'RETURNED'] } }),
  ]);
  return { user, stats: { lost, found, resolved } };
};
exports.updateProfile = async (userId, data, file) => {
  const user = await User.findByPk(userId);
  const changes = {};
  ['name', 'department', 'year', 'phone'].forEach((f) => { if (data[f] !== undefined && data[f] !== '') changes[f] = data[f]; });
  if (file) {
    if (user.profileImage) await removeFile(path.join(uploadDir, path.basename(user.profileImage)));
    changes.profileImage = `/uploads/${file.filename}`;
  }
  await user.update(changes);
  return user;
};
exports.getPublic = async (id) => {
  const user = await User.findByPk(id, { attributes: ['id', 'name', 'department', 'profileImage'] });
  if (!user) throw ApiError.notFound('User not found');
  return user;
};
