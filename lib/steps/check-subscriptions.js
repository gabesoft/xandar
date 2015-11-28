'use strict';

const request = require('request'),
      trans = require('trans');

module.exports = (state, feedId, cb) => {
  request({
    url: state.apiUrl('/feed-subscriptions'),
    method: 'GET',
    qs: { feedId },
    json: true
  }, (err, _, body) => {
    if (err) {
      return cb(err);
    }
    if (body.error) {
      return cb(body.error);
    }

    const ids = trans(body)
            .pluck('userId')
            .uniq()
            .filter('.', id => id !== state.user.id)
            .value();

    if (ids.length > 0) {
      return cb(new Error('Active subscriptions found'));
    }

    cb();
  });
};
