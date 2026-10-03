// Daily midnight job (node-cron): reminders for old ACTIVE items + digest for admins on old PENDING reports.
const cron = require('node-cron');
const { Op } = require('sequelize');
const { Item, Report, Notification } = require('../models');
const notificationService = require('../services/notificationService');

const DAY = 864e5;
async function run() {
  const cutoff = new Date(Date.now() - 30 * DAY).toISOString().slice(0, 10);
  const staleItems = await Item.findAll({ where: { status: 'ACTIVE', date: { [Op.lt]: cutoff } } });
  let reminders = 0;
  for (const item of staleItems) {
    const recent = await Notification.findOne({ where: { userId: item.userId, relatedItemId: item.id, type: 'REMINDER', createdAt: { [Op.gt]: new Date(Date.now() - 7 * DAY) } } });
    if (recent) continue;                                            // at most one reminder per week
    await notificationService.create({ userId: item.userId, type: 'REMINDER', title: 'Is this still unresolved?',
      message: `Your ${item.type.toLowerCase()} report "${item.name}" is over 30 days old. Mark it resolved or closed if done.`, relatedItemId: item.id });
    reminders += 1;
  }
  const staleReports = await Report.count({ where: { status: 'PENDING', createdAt: { [Op.lt]: new Date(Date.now() - 7 * DAY) } } });
  if (staleReports > 0) await notificationService.notifyAdmins({ type: 'REMINDER', title: 'Reports waiting for review',
    message: `${staleReports} report(s) have been pending for more than 7 days.` });
  console.log(`[cron] stale job done: ${reminders} reminders, ${staleReports} stale reports`);
  return { reminders, staleReports };
}
const start = () => cron.schedule('0 0 * * *', () => run().catch((e) => console.error('[cron] failed', e.message)));
module.exports = { run, start };
if (require.main === module) run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
