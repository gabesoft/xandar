'use strict';

const request = require('request'),
      pick = require('lodash').pick,
      maxRecords = 40;

module.exports = (state, opts, cb) => {
  const userId = opts.userId || (state.user || {})._id;
  const sort = (opts.sort || []).join(',');
  const qs = {
    sort,
    per_page: opts.perPage || maxRecords,
    where: `userId eq ${userId}`
  };

  request({
    url: state.apiUrl('/xandar/post-queries'),
    method: 'GET',
    qs,
    json: true
  }, (err, _, postQueries) => {
    state.postQuery = null;
    state.postQueries = [];

    if (err) {
      cb(opts.noErrors ? null : err);
    } else if (!postQueries || postQueries.length === 0) {
      state.log.error(`no post queries found for user ${userId}`);
      cb();
    } else if (postQueries.error) {
      state.log.error(postQueries.error);
      cb();
    } else {
      state.postQuery = postQueries[0];
      state.postQueries = postQueries;
      cb();
    }
  });
};
