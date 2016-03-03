'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, _, cb) => {
  request({
    url: state.conf('github:user-url'),
    method: 'GET',
    json: true,
    headers: {
      'User-Agent': 'Xandar/0.0.1',
      Accept: '*/*',
      Authorization: `token ${state.accessToken}`
    }
  }, (err, _, body) => {
    if (err) {
      state.log.error(err.message);
      cb(err);
    } else if (!body.login) {
      cb(body);
    } else {
      state.githubUser = body;
      state.log.info(`github user ${chalk.yellow(state.githubUser.login)} aquired`);
      cb();
    }
  });
};
