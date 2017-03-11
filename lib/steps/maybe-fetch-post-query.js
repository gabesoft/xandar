'use strict';

const request = require('request');

module.exports = function(state, opts, cb) {
  if (opts._id) {
    return cb();
  }

  const userId = opts.userId || (state.user || {})._id,
        hash = opts.hash,
        where = `(userId eq ${userId}) and (hash eq "${hash}")`;

  request({
    url: state.apiUrl('/xandar/post-queries'),
    method: 'GET',
    qs: { where, per_page: 1 },
    json: true
  }, (err, _, queries) => {
    queries = queries || [];

    if (err) {
      state.log.error(err);
    } else if (queries.error) {
      state.log.error(queries.error);
    } else if (queries.length > 0) {
      state.existingQuery = queries[0];
    } else {
      state.log.warn(`no query found for hash ${hash}`);
    }

    cb();
  });
};
