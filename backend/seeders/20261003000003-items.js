'use strict';
// categoryId: 1 Electronics, 2 Documents, 3 Accessories, 4 Books, 5 Bags, 6 Clothing, 7 Keys, 8 Other, 9 Stationery
const rows = [
  [2, 5, 'LOST', 'Duffel Bag', 'Black sports duffel bag with a red zip and a BCA lab coat inside.', 'Sports Ground', '2026-09-28', 'ACTIVE'],
  [2, 1, 'LOST', 'iPhone 13 Pro', 'Black iPhone with a transparent case and a small crack on the back.', 'College Canteen', '2026-10-02', 'ACTIVE'],
  [3, 1, 'LOST', 'PS5 Controller', 'White DualSense controller with blue LED light bar, left stick drifts slightly.', 'Computer Lab 2', '2026-09-30', 'ACTIVE'],
  [4, 1, 'FOUND', 'Camera', 'Canon DSLR camera with a black strap, found on a bench near the garden.', 'Campus Garden', '2026-10-01', 'ACTIVE'],
  [3, 3, 'LOST', 'Hair Clip', 'Pink butterfly hair clip with small stones.', 'Library', '2026-09-25', 'ACTIVE'],
  [4, 9, 'FOUND', 'Sticker', 'Class sticker for BCA, found near the college campus notice board.', 'Notice Board', '2026-08-04', 'ACTIVE'],
  [2, 1, 'FOUND', 'Headphones', 'Black over-ear wireless headphones left on a desk after the morning lecture.', 'Seminar Hall', '2026-10-02', 'ACTIVE'],
  [3, 3, 'LOST', 'Necklace', 'Thin silver necklace with a small heart pendant.', 'Auditorium', '2026-09-29', 'PENDING'],
  [4, 8, 'FOUND', 'Toy Car', 'Small red toy car found near the main gate parking area.', 'Main Gate', '2026-09-27', 'RETURNED'],
  [2, 9, 'LOST', 'Pikachu Mouse Pad', 'Yellow Pikachu themed mouse pad with a stitched border.', 'Computer Lab 1', '2026-10-01', 'ACTIVE'],
];
module.exports = {
  async up(qi) {
    const now = new Date();
    await qi.bulkInsert('items', rows.map(([userId, categoryId, type, name, description, location, date, status], i) => ({
      id: i + 1, userId, categoryId, type, name, description, location, date, status,
      contactPreference: 'MESSAGE', createdAt: now, updatedAt: now,
    })));
  },
  async down(qi) { await qi.bulkDelete('items', null, {}); },
};
