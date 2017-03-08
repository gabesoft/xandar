'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, subscriptionId, cb) => {
  const data = state.postIds.map(id => ({ read: true, _id: id }));

  console.log(data);

  request({
    url: state.apiUrl('/xandar/user-posts/'),
    method: 'PATCH',
    body: data,
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
