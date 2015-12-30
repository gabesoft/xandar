'use strict';

const request = require('request');

module.exports = (state, opts, cb) => {
  opts = opts || {};
  const id = opts.subscriptionId || (state.subscription || {}).id,
        soft = Boolean(opts.soft);

  if (!id) {
    return cb(new Error(`No subscription found`));
  }

  request({
    url: state.apiUrl(`/feed-subscriptions/${id}`),
    method: 'DELETE',
    qs: { soft },
    json: true
  }, err => cb(err));
};
