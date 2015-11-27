'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, _, cb) => {
  request({
    url: state.apiUrl('/feeds'),
    method: 'GET',
    json: true
  }, (err, _, body) => {
    state.feeds = body;
    state.log.info(`found ${chalk.blue((body || []).length)} feeds`);
    cb(err);
  });
};
