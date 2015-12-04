'use strict';

const handlers = require('./handlers');

module.exports = [{
  method: 'GET',
  path: '/api/feeds',
  config: { auth: 'session' },
  handler: handlers.feeds
}, {
  method: 'GET',
  path: '/api/posts',
  config: { auth: 'session' },
  handler: handlers.posts
}, {
  method: 'POST',
  path: '/api/subscribe/{feedId}',
  config: { auth: 'session' },
  handler: handlers.subscribe
}, {
  method: 'POST',
  path: '/api/subscriptions/{id}',
  config: { auth: 'session' },
  handler: handlers.saveSubscription
}, {
  method: 'POST',
  path: '/api/unsubscribe/{feedId}/{subscriptionId}',
  config: { auth: 'session' },
  handler: handlers.unsubscribe
}, {
  method: 'DELETE',
  path: '/api/feeds/{feedId}',
  config: { auth: 'session' },
  handler: handlers.deleteFeed
}, {
  method: 'GET',
  path: '/api/find-feed',
  config: { auth: 'session' },
  handler: handlers.findFeed
}];
