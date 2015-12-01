'use strict';

const request = require('request');

module.exports = (state, opts, cb) => {
  const userId = opts.userId || state.user.id;
  const feedId = opts.feedId || state.feed.id;

  request({
    url: state.apiUrl(`/feed-subscriptions/${userId}/${feedId}`),
    method: 'GET',
    json: true
  }, (err, _, body) => {
    if (err) {
      cb(opts.noErrors ? null : err);
    } else if (body.error) {
      cb(opts.noErrors ? null : body.error);
    } else {
      state.subscription = body;
      cb();
    }
  });
};
