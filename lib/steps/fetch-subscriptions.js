'use strict';

const request = require('request'),
      pick = require('lodash').pick;

module.exports = (state, opts, cb) => {
  const userId = opts.userId || (state.user || {}).id;
  const feedId = opts.feedId || (state.feed || {}).id;
  const data = pick(opts, 'query', 'fields', 'sort', 'skip', 'limit');
  const body = Object.assign({}, { query: { userId, feedId } }, data);

  request({
    url: state.apiUrl('/search/feed-subscriptions'),
    method: 'POST',
    body,
    json: true
  }, (err, _, subscriptions) => {
    state.subscriptions = [];

    if (err) {
      cb(opts.noErrors ? null : err);
    } else if (!subscriptions || subscriptions.length === 0) {
      state.log.error(`no subscription found for user ${userId} and feed ${feedId}`);
      state.subscription = null;
      state.subscriptions = [];
      cb();
    } else if (subscriptions.error) {
      cb(opts.noErrors ? null : subscriptions.error);
    } else {
      state.subscription = subscriptions[0];
      state.subscriptions = subscriptions;
      cb();
    }
  });
};
