'use strict';

const crypto = require('crypto');

function makeId(userId, query) {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(userId + query.text))
    .digest('hex');
}

module.exports = (state, opts, cb) => {
  const userId = (state.user || {}).id || opts.userId;
  const postQuery = opts.postQuery;
  state.postQueryId = postQuery.id || makeId(userId, postQuery);
  cb();
};
