'use strict';

const request = require('request');

module.exports = (state, feedUri, cb) => {
  request({
    url: state.finderUrl('/feeds'),
    qs: { uri: feedUri },
    method: 'GET',
    json: true
  }, (err, _, body) => {
    if (!body.error) {
      state.feed = body;
    }
    cb(body.error || err);
  });
};
