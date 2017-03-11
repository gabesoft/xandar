'use strict';

const request = require('request');

module.exports = (state, query, cb) => {
  const existing = state.existingQuery || {},
        data = Object.assign(existing, { userId: state.user._id }, query),
        isNew = !data._id,
        method = isNew ? 'POST' : 'PATCH',
        url = isNew ? '/xandar/post-queries' : `/xandar/post-queries/${data._id}`;

  request({
    url: state.apiUrl(url),
    method,
    body: data,
    json: true
  }, (err, _, body) => {
    if (err) {
      cb(err);
    } else if (body.error) {
      state.log.error(body.error);
      cb();
    } else {
      state.postQuery = body;
      cb();
    }
  });
};
