'use strict';

const request = require('request'),
      pick = require('lodash').pick;

const maxRecordSize = 1000;

module.exports = (state, opts, cb) => {
  const userId = opts.userId || (state.user || {}).id;
  const feedId = opts.feedId || (state.feed || {}).id;

  const qs = {};
  const query = opts.allowDisabled ? [] : [ 'disabled eq false' ];
  if (userId) {
    query.push(`userId eq ${userId}`);
  }
  if (feedId) {
    query.push(`feedId eq ${feedId}`);
  }

  qs.where = `(${query.join(' and ')})`;
  qs.fields = (opts.fields || []).join(',');
  qs.per_page = opts.perPage || maxRecordSize;

  request({
    url: state.apiUrl('/xandar/subscriptions'),
    method: 'GET',
    qs,
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
