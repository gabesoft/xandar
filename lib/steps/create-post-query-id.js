'use strict';

const crypto = require('crypto');

function makeId(query) {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(query.text))
    .digest('hex');
}

module.exports = (state, postQuery, cb) => {
  state.postQueryId = postQuery.id || makeId(postQuery);
  cb();
};
