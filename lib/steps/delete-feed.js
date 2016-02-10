'use strict';

const request = require('request');

module.exports = (state, feedId, cb) => {
  request({
    url: state.apiUrl(`/feeds/${feedId}`),
    method: 'DELETE',
    json: true
  }, (err, _, body) => {
    if (!body.error) {
      state.feed = body;
    }
    if (err) {
      state.log.error(err.message);
    }
    cb(body.message || body.error || err);
  });
};
