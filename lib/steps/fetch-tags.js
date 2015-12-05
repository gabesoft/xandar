'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, _, cb) => {
  request({
    url: state.apiUrl(`/users/${state.user.id}/tags`),
    method: 'GET',
    json: true
  }, (err, _, body) => {
    state.tags = body;
    state.log.info(`found ${chalk.blue((body || []).length)} tags`);
    cb(err);
  });
};
