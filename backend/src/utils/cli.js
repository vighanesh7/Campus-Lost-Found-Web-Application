// Command-line arguments demo: node src/utils/cli.js stats   |   node src/utils/cli.js categories
const stats = require('../queries/statsQueries');
const { sequelize } = require('../models');
const [, , command = 'stats'] = process.argv;
(async () => {
  if (command === 'stats') console.table([await stats.itemTotals()]);
  else if (command === 'categories') console.table(await stats.topCategories(10));
  else console.log('Usage: node src/utils/cli.js [stats|categories]');
  await sequelize.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
