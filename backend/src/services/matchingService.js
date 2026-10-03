// Rule-based matching (NOT AI): same category, close dates, shared keywords/location words.
const { Op } = require('sequelize');
const { Item, ItemMatch } = require('../models');
const notificationService = require('./notificationService');

const STOP = new Set(['the', 'a', 'an', 'and', 'of', 'with', 'near', 'in', 'on', 'at', 'is', 'was', 'for', 'to', 'black', 'white']);
const words = (text = '') => new Set(text.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w)));
const overlap = (a, b) => [...a].filter((w) => b.has(w)).length;
const DAY = 24 * 60 * 60 * 1000;

function score(a, b) {
  let s = 20; // same category is a precondition
  s += Math.min(overlap(words(a.name), words(b.name)) * 25, 50);
  s += Math.min(overlap(words(a.description), words(b.description)) * 5, 15);
  s += overlap(words(a.location), words(b.location)) > 0 ? 15 : 0;
  return s;
}

// Finds opposite-type ACTIVE items; saves + notifies matches scoring >= 45.
exports.matchItem = async (item, { dayRange = 30, minScore = 45 } = {}) => {
  const oppositeType = item.type === 'LOST' ? 'FOUND' : 'LOST';
  const base = new Date(item.date).getTime();
  const candidates = await Item.findAll({
    where: {
      type: oppositeType, status: 'ACTIVE', categoryId: item.categoryId,
      userId: { [Op.ne]: item.userId },
      date: { [Op.between]: [new Date(base - dayRange * DAY), new Date(base + dayRange * DAY)] },
    },
  });
  const matches = candidates.map((c) => ({ candidate: c, score: score(item, c) }))
    .filter((m) => m.score >= minScore).sort((a, b) => b.score - a.score);

  for (const { candidate, score: sc } of matches) {
    const lost = item.type === 'LOST' ? item : candidate;
    const found = item.type === 'FOUND' ? item : candidate;
    const [, created] = await ItemMatch.findOrCreate({
      where: { lostItemId: lost.id, foundItemId: found.id }, defaults: { score: sc },
    });
    if (created) {
      await notificationService.create({ userId: lost.userId, type: 'MATCH_FOUND', title: 'Possible match found',
        message: `A found item "${found.name}" may match your lost "${lost.name}".`, relatedItemId: found.id });
      await notificationService.create({ userId: found.userId, type: 'MATCH_FOUND', title: 'Possible match found',
        message: `Your found item "${found.name}" may belong to someone who lost "${lost.name}".`, relatedItemId: lost.id });
    }
  }
  return matches.map((m) => ({ item: m.candidate, score: m.score }));
};
