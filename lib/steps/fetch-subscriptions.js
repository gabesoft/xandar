'use strict';

const request = require('request');

module.exports = (state, opts, cb) => {
  const userId = opts.userId || (state.user || {}).id;
  const feedId = opts.feedId || (state.feed || {}).id;

  request({
    url: state.apiUrl('/search/feed-subscriptions'),
    method: 'POST',
    body: { query: { userId, feedId } },
    json: true
  }, (err, _, body) => {
    state.subscriptions = [];

    if (err) {
      cb(opts.noErrors ? null : err);
    } else if (!body || body.length === 0) {
      state.log.error(`no subscription found for user ${userId} and feed ${feedId}`);
      state.subscription = null;
      state.subscriptions = [];
      cb();
    } else if (body.error) {
      cb(opts.noErrors ? null : body.error);
    } else {
      state.subscription = body[0];
      state.subscriptions = body;
      cb();
    }
  });
};
