const express = require('express');
const cors = require('cors');
const path = require('path');
const { clientUrl } = require('./config/env');
const requestLogger = require('./middleware/requestLogger');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
require('./events/listeners');

const app = express();
app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', require('./routes/apiGateway'));
app.use(notFound);
app.use(errorHandler);
module.exports = app;
