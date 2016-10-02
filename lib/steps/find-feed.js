'use strict';

const request = require('request');

module.exports = (state, feedUri, cb) => {
  request({
    url: state.finderUrl('/feeds'),
    qs: { uri: feedUri },
    method: 'GET',
    json: true
  }, (err, response, body) => {
    if (!body) {
      cb(new Error('no feed found'));
    } else if (!body.error && typeof body === 'object') {
      state.feed = body || {};
      state.feed.isNew = state.feed.isNew || response.statusCode === 201;
      cb();
    } else {
      cb(body.error || err);
    }
  });
};
