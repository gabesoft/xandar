'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, subscriptionId, cb) => {
  request({
    url: state.apiUrl(`/bulk/user-posts/${subscriptionId}`),
    method: 'PATCH',
    body: { data: { read: true }, postIds: state.postIds },
    json: true
  }, (err, _, body) => {
    if (err) {
      cb(err);
    } else if (body.error) {
      cb(body);
    } else {
      state.posts = body;
      state.log.info(`Marked ${chalk.blue(body.length)} posts as read`);
      cb();
    }
  });
};
