'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, _, cb) => {
  request({
    url: state.apiUrl(`/xandar/tags`),
    qs: { where: `(userId eq ${state.user._id})` },
    method: 'GET',
    json: true
  }, (err, _, body) => {
    const data = body[0] || { tags: [] };
    state.data = data;
    state.log.info(`found ${chalk.blue(data.tags.length)} tags`);
    cb(err);
  });
};
