'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, params, cb) => {
  request({
    url: state.apiUrl('/search/posts'),
    method: 'POST',
    body: params,
    json: true
  }, (err, _, body) => {
    state.posts = body;
    state.log.info(`found ${chalk.blue((body || []).length)} posts`);
    cb(err);
  });
};
