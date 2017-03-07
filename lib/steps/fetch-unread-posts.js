'use strict';

const request = require('request'),
      Query = require('../search-query').Query,
      chalk = require('chalk');

module.exports = (state, subscriptionId, cb) => {
  const query = new Query({})
          .andTerm('subscriptionId', subscriptionId)
          .andTerm('read', false);

  request({
    url: state.apiUrl('/search/user-posts'),
    method: 'POST',
    body: {
      query: { query: query.query },
      limit: 10000
    },
    json: true
  }, (err, _, body) => {
    state.posts = body;
    state.postIds = (body || []).map(post => post.postId);
    state.log.info(`Found ${chalk.blue((body || []).length)} unread posts`);
    cb(err);
  });
};
