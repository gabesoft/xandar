'use strict';

const request = require('request');

module.exports = (state, opts, cb) => {
  opts = opts || {};
  const id = opts.subscriptionId || (state.subscription || {})._id,
        soft = Boolean(opts.soft),
        url = state.apiUrl(`/xandar/subscriptions/${id}`),
        respond = err => {
          if (err) {
            state.log.error(err.message);
          }
          cb();
        };

  if (!id) {
    state.log.error('no subscription found');
    return cb();
  }

  if (soft) {
    request({
      url,
      method: 'PATCH',
      body: { disabled: true },
      json: true
    }, respond);
  } else {
    request({
      url,
      method: 'DELETE',
      json: true
    }, respond);

  }
};
