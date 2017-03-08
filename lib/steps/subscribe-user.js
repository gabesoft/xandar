'use strict';

const request = require('request');

module.exports = (state, opts, cb) => {
  const userId = opts.userId || state.user._id;
  const feedId = opts.feedId || state.feed._id;

  if (state.subscription) {
    state.log.warn(`user ${userId} is already subscribed to feed ${feedId}`);
    return cb();
  }

  request({
    url: state.apiUrl('/feed-subscriptions'),
    method: 'POST',
    body: { feedId, userId },
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
