'use strict';

const request = require('request');

module.exports = (state, subscription, cb) => {
  request({
    url: state.apiUrl(`/feed-subscriptions/${subscription.id}`),
    method: 'PUT',
    body: subscription,
    json: true
  }, (err, _, body) => {
    if (err) {
      cb(err);
    } else if (body.error) {
      cb(body);
    } else {
      state.subscription = body;
      cb();
    }
  });
};
