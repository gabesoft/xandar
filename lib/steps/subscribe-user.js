'use strict';

const request = require('request'),
      pick = require('lodash').pick;

module.exports = (state, opts, cb) => {
  request({
    url: state.apiUrl('/feed-subscriptions'),
    method: 'POST',
    body: pick(opts, ['feedId', 'userId']),
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
