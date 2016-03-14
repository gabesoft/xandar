'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, _, cb) => {
  if (state.user) {
    state.log.warn('user already exists ... skipping create');
    return cb();
  }

  request({
    url: state.apiUrl('/users'),
    method: 'POST',
    json: true,
    body: {
      email: state.githubUser.email,
      type: 'xandar',
      meta: state.githubUser
    }
  }, (err, _, body) => {
    state.log.error((err || {}).message);
    state.log.info(JSON.stringify(body || {}));
    if (err) {
      cb(err);
    } else if (body.error) {
      cb(body.error);
    } else {
      state.log.info(`created user with email ${chalk.green(body.email)}`);
      state.user = body;
      cb();
    }
  });
};
