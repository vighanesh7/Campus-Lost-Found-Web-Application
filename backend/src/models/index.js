// Loads every model file, then wires associations (hasOne/hasMany/belongsTo/belongsToMany).
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);
const db = {};

fs.readdirSync(__dirname)
  .filter((f) => f !== 'index.js' && f.endsWith('.js'))
  .forEach((f) => {
    const model = require(path.join(__dirname, f))(sequelize, DataTypes);
    db[model.name] = model;
  });

const { User, Category, Item, ItemImage, Favorite, Conversation, ConversationParticipant,
  Message, Notification, Report, AuditLog, ItemMatch } = db;

// 1:M
User.hasMany(Item, { foreignKey: 'userId', as: 'items' });
Item.belongsTo(User, { foreignKey: 'userId', as: 'reporter' });
Category.hasMany(Item, { foreignKey: 'categoryId', as: 'items' });
Item.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Item.hasMany(ItemImage, { foreignKey: 'itemId', as: 'images', onDelete: 'CASCADE' });
ItemImage.belongsTo(Item, { foreignKey: 'itemId' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId' });
Notification.belongsTo(Item, { foreignKey: 'relatedItemId', as: 'item' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages', onDelete: 'CASCADE' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });
Conversation.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });
Item.hasMany(Report, { foreignKey: 'itemId', as: 'reports', onDelete: 'CASCADE' });
Report.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });
User.hasMany(Report, { foreignKey: 'reportedBy', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'reportedBy', as: 'reporter' });
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// M:N  Users <-> Conversations (through conversation_participants)
User.belongsToMany(Conversation, { through: ConversationParticipant, foreignKey: 'userId', otherKey: 'conversationId', as: 'conversations' });
Conversation.belongsToMany(User, { through: ConversationParticipant, foreignKey: 'conversationId', otherKey: 'userId', as: 'participants' });
ConversationParticipant.belongsTo(User, { foreignKey: 'userId' });
ConversationParticipant.belongsTo(Conversation, { foreignKey: 'conversationId' });

// M:N  Users <-> Items (favorites)
User.belongsToMany(Item, { through: Favorite, foreignKey: 'userId', otherKey: 'itemId', as: 'favoriteItems' });
Item.belongsToMany(User, { through: Favorite, foreignKey: 'itemId', otherKey: 'userId', as: 'favoritedBy' });
Favorite.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

// M:N  Items <-> Items (possible matches: lost item <-> found item)
Item.belongsToMany(Item, { through: ItemMatch, foreignKey: 'lostItemId', otherKey: 'foundItemId', as: 'possibleMatches' });
Item.belongsToMany(Item, { through: ItemMatch, foreignKey: 'foundItemId', otherKey: 'lostItemId', as: 'matchedWith' });
ItemMatch.belongsTo(Item, { foreignKey: 'lostItemId', as: 'lostItem' });
ItemMatch.belongsTo(Item, { foreignKey: 'foundItemId', as: 'foundItem' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
