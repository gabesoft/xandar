'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, tag, cb) => {
  if (!tag) {
    return cb(new Error('No tag specified'));
  }

  request({
    url: state.apiUrl(`/users/${state.user.id}/tags/${tag}`),
    method: 'DELETE',
    json: true
  }, (err) => {
    if (!err) {
      state.log.info(`delete tag ${chalk.yellow(tag)}`);
    }
    cb(err);
  });
};
