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
    cb(body.error || err);
  });
};
