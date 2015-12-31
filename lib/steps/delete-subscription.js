'use strict';

const request = require('request');

module.exports = (state, opts, cb) => {
  opts = opts || {};
  const id = opts.subscriptionId || (state.subscription || {}).id,
        soft = Boolean(opts.soft);

  if (!id) {
    state.log.error('no subscription found');
    return cb();
  }

  request({
    url: state.apiUrl(`/feed-subscriptions/${id}`),
    method: 'DELETE',
    qs: { soft },
    json: true
  }, err => {
    if (err) {
      state.log.error(err.message);
    }
    cb();
  });
};
