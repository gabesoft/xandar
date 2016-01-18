'use strict';

const request = require('request'),
      Query = require('../search-query').Query,
      chalk = require('chalk');

module.exports = (state, params, cb) => {
  const data = Object.assign({}, params),
        query = new Query(data.query).andTerm('userId', state.user.id);

  require('eyes').inspect(query.query);
  request({
    url: state.apiUrl('/search/user-posts'),
    method: 'POST',
    body: {
      query: { query: query.query },
      limit: data.limit,
      skip: data.skip,
      sort: data.sort
    },
    json: true
  }, (err, _, body) => {
    state.posts = body;
    state.log.info(`found ${chalk.blue((body.hits || []).length)} posts`);
    cb(err);
  });
};
