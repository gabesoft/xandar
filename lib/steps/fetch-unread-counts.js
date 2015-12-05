'use strict';

const request = require('request');

module.exports = (state, _, cb) => {
  const user = state.user;

  request({
    url: state.apiUrl(`/user/${user.id}/unread-counts`),
    method: 'GET',
    json: true
  }, (err, _, body) => {
    if (!err && Array.isArray(body)) {
      state.unreadCounts = body;
      cb();
    } else if (!Array.isArray(body)) {
      state.log.error(body);
      cb(body);
    } else {
      cb(err);
    }
  });
};
