'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, tag, cb) => {
  if (!tag) {
    return cb(new Error('No tag specified'));
  }
  if (!state.data || !state.data._id) {
    return cb(new Error('Current user has no tags'));
  }

  const data = state.data;
  data.tags = data.tags.filter(t => t !== tag);

  request({
    url: state.apiUrl(`/xandar/tags/${data._id}`),
    method: 'PATCH',
    body: data,
    json: true
  }, (err, _, body) => {
    if (!err) {
      state.log.info(`delete tag ${chalk.yellow(tag)}`);
    }
    state.data = body || { tags: [] };
    cb(err);
  });
};
