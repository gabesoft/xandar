'use strict';

const request = require('request');

module.exports = (state, post, cb) => {
  const data = post;
  request({
    url: state.apiUrl(`/xandar/user-posts/${data._id}`),
    method: 'PATCH',
    body: data,
    json: true
  }, (err, _, body) => {
    if (err) {
      cb(err);
    } else if (body.error) {
      state.log.error(body.error);
      cb();
    } else {
      state.post = body;
      cb();
    }
  });
};
