const { port } = require('./src/config/env');
const app = require('./src/app');
const { sequelize } = require('./src/models');
const { ensureDir, uploadDir, logDir } = require('./src/utils/fileUtils');
const staleJob = require('./src/jobs/staleReportsJob');

// Command-line argument: node server.js --port=5001
const portArg = process.argv.find((a) => a.startsWith('--port='));
const PORT = portArg ? Number(portArg.split('=')[1]) : port;

(async () => {
  try {
    await Promise.all([ensureDir(uploadDir), ensureDir(logDir)]);
    await sequelize.authenticate();
    console.log('MySQL connected via Sequelize');
    staleJob.start();
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}/api`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();
