'use strict';

const request = require('request');

module.exports = (state, feedId, cb) => {
  request({
    url: state.apiUrl(`/xandar/feeds/${feedId}`),
    method: 'DELETE',
    json: true
  }, (err, _, body) => {
    if (err) {
      state.log.error(err.message);
    }
    cb(err);
  });
};
