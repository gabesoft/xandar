'use strict';

const request = require('request');

module.exports = (state, feedUri, cb) => {
  request({
    url: state.finderUrl('/feeds'),
    qs: { uri: feedUri },
    method: 'GET',
    json: true
  }, (err, _, body) => {
    if (!body) {
      cb(new Error('no feed found'));
    } else if (!body.error) {
      state.feed = body;
      cb();
    } else {
      cb(body.error || err);
    }
  });
};
