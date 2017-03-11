'use strict';

const request = require('request');

module.exports = (state, opts, cb) => {
  const userId = opts.userId || state.user._id;
  const feedId = opts.feedId || state.feed._id;

  const subscription = state.subscription || state.subscriptions[0];

  if (subscription && !subscription.disabled) {
    state.log.warn(`user ${userId} is already subscribed to feed ${feedId}`);
    return cb();
  }

  const isNew = !Boolean(subscription && subscription._id);
  const method = isNew ? 'POST' : 'PATCH';
  const url = isNew
    ? '/xandar/subscriptions'
    : `/xandar/subscriptions/${subscription._id}`;

  request({
    url: state.apiUrl(url),
    method: method,
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
