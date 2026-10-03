// Event-driven side effects: services emit events, listeners react (notifications, matching).
const events = require('./appEvents');
const notificationService = require('../services/notificationService');
const matchingService = require('../services/matchingService');

const safe = (fn) => async (...args) => { try { await fn(...args); } catch (e) { console.error('[event error]', e.message); } };

events.on('itemReported', safe(async (item) => {
  await notificationService.create({ userId: item.userId, type: 'ITEM_REPORTED', title: 'Report submitted',
    message: `Your ${item.type.toLowerCase()} report "${item.name}" is now live.`, relatedItemId: item.id });
  await matchingService.matchItem(item);
  events.emit('itemMatchChecked', item);
}));

events.on('itemStatusChanged', safe(async ({ item, by }) => {
  if (by.id !== item.userId) {
    await notificationService.create({ userId: item.userId, type: 'ADMIN_ACTION', title: 'Report updated by admin',
      message: `Status of "${item.name}" is now ${item.status}.`, relatedItemId: item.id });
  }
}));

events.on('itemResolved', safe(async (item) => {
  await notificationService.create({ userId: item.userId, type: 'ITEM_RESOLVED', title: 'Item resolved',
    message: `"${item.name}" was marked ${item.status.toLowerCase()}.`, relatedItemId: item.id });
}));

events.on('messageSent', safe(async ({ message, recipientIds, senderName }) => {
  await Promise.all(recipientIds.map((userId) => notificationService.create({
    userId, type: 'MESSAGE', title: 'New message', message: `${senderName} sent you a message.` })));
}));

module.exports = events;
