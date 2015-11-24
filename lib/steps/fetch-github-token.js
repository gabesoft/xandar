'use strict';

const request = require('request');

module.exports = (state, opts, cb) => {
  request({
    url: state.conf('github:token-url'),
    json: true,
    body: {
      client_id: state.conf('github:client-id'),
      client_secret: state.conf('github:client-secret'),
      code: opts.code,
      state: opts.state
    }
  }, (err, _, body) => {
    if (err) {
      cb(err);
    } else if (!body.access_token) {
      cb(body);
    } else {
      state.accessToken = body.access_token;
      cb();
    }
  });
};
