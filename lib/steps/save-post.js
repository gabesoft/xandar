'use strict';

const request = require('request');

module.exports = (state, post, cb) => {
  const data = post._source;
  request({
    url: state.apiUrl(`/user-posts/${data.subscriptionId}/${data.postId}`),
    method: 'PATCH',
    body: data,
    json: true
  }, (err, _, body) => {
    if (err) {
      cb(err);
    } else if (body.error) {
      cb(body);
    } else {
      state.subscription = body;
      cb();
    }
  });
};
