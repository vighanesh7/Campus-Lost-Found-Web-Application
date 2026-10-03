const { Favorite, Item } = require('../models');
const ApiError = require('../utils/ApiError');
const itemService = require('./itemService');
exports.add = async (userId, itemId) => {
  if (!(await Item.findByPk(itemId))) throw ApiError.notFound('Item not found');
  const [favorite] = await Favorite.findOrCreate({ where: { userId, itemId } }); // unique(userId,itemId)
  return favorite;
};
exports.remove = async (userId, itemId) => {
  if (!(await Favorite.destroy({ where: { userId, itemId } }))) throw ApiError.notFound('Item is not in your favourites');
};
exports.list = (userId) => Favorite.findAll({
  where: { userId }, order: [['createdAt', 'DESC']],
  include: [{ model: Item, as: 'item', include: itemService.buildIncludes() }],
});
