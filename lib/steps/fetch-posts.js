'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, params, cb) => {
  const data = Object.assign({}, params);
  const userQuery = { bool: { must: { term: { userId: state.user.id } } } };

  if (data.query && data.query.bool) {
    data.query = {
      bool: {
        must: [
          userQuery.bool.must,
          data.query
        ]
      }
    };
  } else {
    data.query = Object.assign(userQuery, data.query);
  }

  data.query = { query: data.query };
  request({
    url: state.apiUrl('/search/user-posts'),
    method: 'POST',
    body: data,
    json: true
  }, (err, _, body) => {
    state.posts = body;
    state.log.info(`found ${chalk.blue((body.hits || []).length)} posts`);
    cb(err);
  });
};
