'use strict';

const request = require('request');

module.exports = (state, postQuery, cb) => {
  const id = state.postQueryId,
        exists = Boolean(state.postQuery),
        data = Object.assign({ _id: id, userId: state.user.id }, postQuery);

  request({
    url: exists
      ? state.apiUrl(`/post-queries/${data._id}`)
      : state.apiUrl('/post-queries'),
    method: exists ? 'PATCH' : 'POST',
    body: data,
    json: true
  }, (err, _, body) => {
    if (err) {
      cb(err);
    } else if (body.error) {
      cb(body);
    } else {
      state.postQuery = body;
      cb();
    }
  });
};
