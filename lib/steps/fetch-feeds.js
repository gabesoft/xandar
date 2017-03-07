'use strict';

const request = require('request'),
      chalk = require('chalk');

const maxRecordSize = 1000;

module.exports = (state, _, cb) => {
  request({
    url: state.apiUrl('/xandar/feeds'),
    qs: { per_page: maxRecordSize },
    method: 'GET',
    json: true
  }, (err, _, body) => {
    state.feeds = body;
    state.log.info(`found ${chalk.blue((body || []).length)} feeds`);
    cb(err);
  });
};
