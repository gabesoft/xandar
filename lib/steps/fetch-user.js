'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, _, cb) => {
  request({
    url: state.apiUrl('/users'),
    method: 'GET',
    qs: { email: state.githubUser.email, type: 'xandar' },
    json: true
  }, (err, _, body) => {
    if (!err && body.length === 1) {
      state.log.info(`found a user with email ${chalk.green(state.githubUser.email)}`);
      state.user = body[0];
    } else {
      state.log.warn(`no user found with email ${chalk.yellow(state.githubUser.email)}`);
    }
    cb(err);
  });
};

