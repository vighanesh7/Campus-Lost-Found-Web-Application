const { Op } = require('sequelize');
const { Conversation, ConversationParticipant, Message, User, Item, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');
const events = require('../events/appEvents');

const userAttrs = ['id', 'name', 'profileImage', 'department'];
const myConversationIds = async (userId) =>
  (await ConversationParticipant.findAll({ where: { userId }, attributes: ['conversationId'], raw: true })).map((r) => r.conversationId);

// An existing conversation between two users about the same item (or no item).
async function findShared(me, other, itemId) {
  const ids = await myConversationIds(me);
  if (!ids.length) return null;
  const row = await ConversationParticipant.findOne({
    where: { userId: other, conversationId: ids },
    include: [{ model: Conversation, where: { itemId: itemId ?? null }, required: true }],
  });
  return row ? row.conversationId : null;
}

exports.send = async (user, { conversationId, recipientId, itemId, message }) => {
  let convId = conversationId ? Number(conversationId) : null;
  let recipientIds;
  if (convId) {
    const parts = await ConversationParticipant.findAll({ where: { conversationId: convId } });
    if (!parts.some((p) => p.userId === user.id)) throw ApiError.forbidden('You are not part of this conversation');
    recipientIds = parts.filter((p) => p.userId !== user.id).map((p) => p.userId);
  } else {
    const rid = Number(recipientId);
    if (!rid || rid === user.id) throw ApiError.badRequest('Choose another user to message');
    if (!(await User.findByPk(rid))) throw ApiError.notFound('Recipient not found');
    convId = await findShared(user.id, rid, itemId ? Number(itemId) : null);
    if (!convId) {
      const conv = await sequelize.transaction(async (t) => {
        const c = await Conversation.create({ itemId: itemId || null }, { transaction: t });
        await ConversationParticipant.bulkCreate(
          [{ conversationId: c.id, userId: user.id }, { conversationId: c.id, userId: rid }], { transaction: t });
        return c;
      });
      convId = conv.id;
    }
    recipientIds = [rid];
  }
  const msg = await Message.create({ conversationId: convId, senderId: user.id, message });
  events.emit('messageSent', { message: msg, recipientIds, senderName: user.name });
  return { message: msg, conversationId: convId };
};

exports.listConversations = async (userId) => {
  const ids = await myConversationIds(userId);
  if (!ids.length) return [];
  const [convs, msgs] = await Promise.all([
    Conversation.findAll({ where: { id: ids }, include: [
      { model: User, as: 'participants', attributes: userAttrs, through: { attributes: [] } },
      { model: Item, as: 'item', attributes: ['id', 'name', 'image'] }] }),
    Message.findAll({ where: { conversationId: ids }, order: [['createdAt', 'DESC'], ['id', 'DESC']] }),
  ]);
  return convs.map((c) => {
    const cm = msgs.filter((m) => m.conversationId === c.id);
    return { id: c.id, item: c.item, other: c.participants.find((p) => p.id !== userId) || null,
      lastMessage: cm[0] || null, unreadCount: cm.filter((m) => m.senderId !== userId && !m.readAt).length };
  }).sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0));
};

exports.getConversation = async (userId, conversationId) => {
  const ids = await myConversationIds(userId);
  if (!ids.includes(Number(conversationId))) throw ApiError.notFound('Conversation not found');
  const conv = await Conversation.findByPk(conversationId, { include: [
    { model: User, as: 'participants', attributes: userAttrs, through: { attributes: [] } },
    { model: Item, as: 'item', attributes: ['id', 'name', 'image'] }] });
  const messages = await Message.findAll({ where: { conversationId }, order: [['createdAt', 'ASC'], ['id', 'ASC']] });
  await Message.update({ readAt: new Date() }, { where: { conversationId, senderId: { [Op.ne]: userId }, readAt: null } });
  return { conversation: { id: conv.id, item: conv.item, other: conv.participants.find((p) => p.id !== userId) || null }, messages };
};

exports.markRead = async (userId, messageId) => {
  const msg = await Message.findByPk(messageId);
  if (!msg) throw ApiError.notFound('Message not found');
  const ids = await myConversationIds(userId);
  if (!ids.includes(msg.conversationId) || msg.senderId === userId) throw ApiError.forbidden();
  return msg.update({ readAt: msg.readAt || new Date() });
};
