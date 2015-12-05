'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, tags, cb) => {
  request({
    url: state.apiUrl(`/users/${state.user.id}/tags`),
    method: 'POST',
    body: tags,
    json: true
  }, (err, _, body) => {
    state.tags = body;
    state.log.info(`saved ${chalk.blue((tags || []).length)} tags`);
    cb(err);
  });
};
