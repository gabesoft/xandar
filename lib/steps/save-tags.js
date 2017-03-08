'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, data, cb) => {
  const isNew = !Boolean(data._id);
  const method = isNew ? 'POST' : 'PATCH';
  const url = isNew ? '/xandar/tags' : `/xandar/tags/${data._id}`;

  request({
    url: state.apiUrl(url),
    method,
    body: Object.assign({}, {userId: state.user._id}, data),
    json: true
  }, (err, _, body) => {
    state.tags = body;
    state.log.info(`saved ${chalk.blue((state.tags || []).length)} tags`);
    cb(err);
  });
};
