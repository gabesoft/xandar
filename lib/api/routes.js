'use strict';

const handlers = require('./handlers');

module.exports = [{
  method: 'GET',
  path: '/api/feeds',
  config: { auth: 'session' },
  handler: handlers.feeds
}, {
  method: 'GET',
  path: '/api/subscription-titles',
  config: { auth: 'session' },
  handler: handlers.subscriptionTitles
}, {
  method: 'POST',
  path: '/api/posts',
  config: { auth: 'session' },
  handler: handlers.posts
}, {
  method: 'POST',
  path: '/api/search/post-queries',
  config: { auth: 'session' },
  handler: handlers.postQueries
}, {
  method: 'PUT',
  path: '/api/subscriptions',
  config: { auth: 'session' },
  handler: handlers.subscribe
}, {
  method: 'POST',
  path: '/api/subscriptions/{id}',
  config: { auth: 'session' },
  handler: handlers.saveSubscription
}, {
  method: 'POST',
  path: '/api/posts/{id}',
  config: { auth: 'session' },
  handler: handlers.savePost
}, {
  method: 'POST',
  path: '/api/post-queries',
  config: { auth: 'session' },
  handler: handlers.savePostQuery
}, {
  method: 'DELETE',
  path: '/api/subscriptions/{id}',
  config: { auth: 'session' },
  handler: handlers.unsubscribe
}, {
  method: 'POST',
  path: '/api/mark-posts-as-read/{subscriptionId}',
  config: { auth: 'session' },
  handler: handlers.markPostsAsRead
}, {
  method: 'DELETE',
  path: '/api/feeds/{feedId}',
  config: { auth: 'session' },
  handler: handlers.deleteFeed
}, {
  method: 'POST',
  path: '/api/add-feed',
  config: { auth: 'session' },
  handler: handlers.addFeed
}, {
  method: 'GET',
  path: '/api/tags',
  config: { auth: 'session' },
  handler: handlers.fetchTags
}, {
  method: 'POST',
  path: '/api/tags',
  config: { auth: 'session' },
  handler: handlers.saveTags
}, {
  method: 'DELETE',
  path: '/api/tags/{tag}',
  config: { auth: 'session' },
  handler: handlers.deleteTag
}];
