// Single shared EventEmitter. Emitters: services. Listeners: events/listeners.js
const { EventEmitter } = require('events');
module.exports = new EventEmitter();
