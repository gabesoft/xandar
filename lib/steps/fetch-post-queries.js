'use strict';

const request = require('request'),
      pick = require('lodash').pick;

module.exports = (state, opts, cb) => {
  opts = opts || {};

  const userId = opts.userId || (state.user || {}).id;
  const data = pick(opts, 'query', 'fields', 'sort', 'skip', 'limit');
  const body = Object.assign({}, { query: { userId, _id: state.postQueryId || opts.id } }, data);

  request({
    url: state.apiUrl('/search/post-queries'),
    method: 'POST',
    body,
    json: true
  }, (err, _, postQueries) => {
    state.postQueries = [];

    if (err) {
      cb(opts.noErrors ? null : err);
    } else if (!postQueries || postQueries.length === 0) {
      state.log.error(`no post queries found for user ${userId}`);
      state.postQuery = null;
      state.postQueries = [];
      cb();
    } else if (postQueries.error) {
      cb(opts.noErrors ? null : postQueries.error);
    } else {
      state.postQuery = postQueries[0];
      state.postQueries = postQueries;
      cb();
    }
  });
};
