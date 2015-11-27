'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, _, cb) => {
  const user = state.user;

  request({
    url: state.apiUrl(`/feed-subscriptions/${user.id}`),
    method: 'GET',
    json: true
  }, (err, _, body) => {
    if (!err && Array.isArray(body)) {
      state.log.info(`user ${chalk.green(user.email)} has ${chalk.blue((body || []).length)} subscriptions`);
      state.subscriptions = body;
      cb();
    } else if (!Array.isArray(body)) {
      state.log.error(body);
      cb(body);
    } else {
      cb(err);
    }
  });
};
