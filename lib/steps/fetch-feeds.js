'use strict';

const request = require('request'),
      chalk = require('chalk'),
      url = require('url');

module.exports = (state, _, cb) => {
  request({
    url: url.resolve(state.conf('api:url'), '/feeds'),
    method: 'GET',
    json: true
  }, (err, _, body) => {
    state.feeds = body;
    state.log.info(`found ${chalk.blue((body || []).length)} feeds`);
    cb(err);
  });
};
