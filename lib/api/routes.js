'use strict';

const handlers = require('./handlers');

module.exports = [{
  method: 'GET',
  path: '/api/feeds',
  config: { auth: 'session' },
  handler: handlers.feeds
}, {
  method: 'POST',
  path: '/api/subscribe/{feedId}',
  config: { auth: 'session' },
  handler: handlers.subscribe
}, {
  method: 'POST',
  path: '/api/unsubscribe/{feedId}',
  config: { auth: 'session' },
  handler: handlers.unsubscribe
}];
