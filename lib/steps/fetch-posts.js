'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, query, cb) => {
  request({
    url: state.apiUrl('/posts'),
    method: 'GET',
    qs: query,
    json: true
  }, (err, _, body) => {
    state.posts = body;
    state.log.info(`found ${chalk.blue((body || []).length)} posts`);
    cb(err);
  });
};
