'use strict';
const names = [
  ['Electronics', 'Phones, cameras, headphones, chargers'], ['Documents', 'ID cards, certificates, papers'],
  ['Accessories', 'Jewellery, hair clips, watches'], ['Books', 'Textbooks and notebooks'],
  ['Bags', 'Backpacks, duffel bags, pouches'], ['Clothing', 'Jackets, scarves, caps'],
  ['Keys', 'Keys and key chains'], ['Other', 'Anything else'], ['Stationery', 'Pens, mouse pads, stickers'],
];
module.exports = {
  async up(qi) {
    const now = new Date();
    await qi.bulkInsert('categories', names.map(([name, description], i) => ({ id: i + 1, name, description, createdAt: now, updatedAt: now })));
  },
  async down(qi) { await qi.bulkDelete('categories', null, {}); },
};
