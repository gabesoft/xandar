'use strict';

const handlers = require('./handlers'),
      conf = require('../../conf/store');

module.exports = [{
  method: 'GET',
  path: '/logout',
  config: { auth: 'session' },
  handler: handlers.logout
}, {
  method: 'GET',
  path: '/login',
  config: {
    auth: { mode: 'try', strategy: 'session' },
    plugins: { 'hapi-auth-cookie': { redirectTo: false } }
  },
  handler: handlers.login
}, {
  method: 'GET',
  path: conf.get('github:callback'),
  config: {
    auth: { mode: 'try', strategy: 'session' },
    plugins: { 'hapi-auth-cookie': { redirectTo: false } }
  },
  handler: handlers.githubCallback
}];
