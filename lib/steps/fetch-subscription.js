'use strict';

const request = require('request'),
      pick = require('lodash').pick;

module.exports = (state, opts, cb) => {
  request({
    url: state.apiUrl(`/feed-subscriptions/${opts.userId}/${opts.feedId}`),
    method: 'GET',
    qs: pick(opts, 'feedId'),
    json: true
  }, (err, _, body) => {
    if (err) {
      cb(err);
    } else if (body.error) {
      cb(body.error);
    } else {
      state.subscription = body;
      cb();
    }
  });
};
