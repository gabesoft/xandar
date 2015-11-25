'use strict';

const handlers = require('./handlers');

module.exports = [{
  method: 'GET',
  path: '/api/feeds',
  config: { auth: 'session' },
  handler: handlers.feeds
}];
