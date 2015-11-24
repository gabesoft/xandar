'use strict';

const request = require('request'),
      chalk = require('chalk'),
      url = require('url');

module.exports = (state, _, cb) => {
  if (state.user) {
    state.log.warn('user already exists ... skipping create');
    return cb();
  }

  request({
    url: url.resolve(state.conf('api:url'), '/users'),
    method: 'POST',
    json: true,
    body: {
      email: state.githubUser.email,
      type: 'xandar',
      meta: state.githubUser
    }
  }, (err, _, body) => {
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
