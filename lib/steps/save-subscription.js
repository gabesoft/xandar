'use strict';

const request = require('request');

module.exports = (state, data, cb) => {
  const subscription = (data && data._id) ? data : state.subscription;
  request({
    url: state.apiUrl(`/xandar/subscriptions/${subscription._id}`),
    method: 'PATCH',
    body: subscription,
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
