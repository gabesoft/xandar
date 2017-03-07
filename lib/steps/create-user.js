'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, _, cb) => {
  if (state.user) {
    state.log.warn('user already exists ... skipping create');
    return cb();
  }

  request({
    url: state.apiUrl('/xandar/users'),
    method: 'POST',
    json: true,
    body: {
      email: state.githubUser.email,
      githubAvatar: state.githubUser.avatar_url,
      githubUrl: state.githubUser.url,
      githubLogin: state.githubUser.login
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
