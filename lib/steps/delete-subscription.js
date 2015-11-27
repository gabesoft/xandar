'use strict';

const request = require('request');

module.exports = (state, _, cb) => {
  if (!state.subscription) {
    return cb(new Error(`No subscription found`));
  }

  request({
    url: state.apiUrl(`/feed-subscriptions/${state.subscription.id}`),
    method: 'DELETE',
    json: true
  }, err => cb(err));
};
