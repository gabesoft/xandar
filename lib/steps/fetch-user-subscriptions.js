'use strict';

const request = require('request'),
      url = require('url');

module.exports = (state, _, cb) => {
  const user = state.user;

  request({
    url: url.resolve(state.conf('api:url'), `/feed-subscriptions/${user.id}`),
    method: 'GET',
    json: true
  }, (err, _, body) => {
    state.subscriptions = body;
    cb(err);
  });
};
