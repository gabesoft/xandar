'use strict';

const request = require('request');

module.exports = (state, subscriptionId, cb) => {
  const id = subscriptionId || (state.subscription || {}).id;

  if (!id) {
    return cb(new Error(`No subscription found`));
  }

  request({
    url: state.apiUrl(`/feed-subscriptions/${id}`),
    method: 'DELETE',
    json: true
  }, err => cb(err));
};
