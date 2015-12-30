'use strict';

const request = require('request'),
      chalk = require('chalk');

module.exports = (state, params, cb) => {
  const data = Object.assign({}, params);
  data.query = Object.assign({ userId: state.user.id }, data.query);
  data.query = {
    query: {
      bool: {
        must: Object.keys(data.query).map(key => {
          const query = { term: {} };
          query.term[key] = data.query[key];
          return query;
        })
      }
    }
  };

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
