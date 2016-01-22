'use strict';

const crypto = require('crypto');

module.exports = (state, postQuery, cb) => {
  state.postQueryId = crypto
    .createHash('md5')
    .update(JSON.stringify(postQuery.data))
    .digest('hex');
  cb();
};
