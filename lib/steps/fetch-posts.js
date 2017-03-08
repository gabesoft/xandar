'use strict';

const request = require('request'),
      Query = require('../search-query').Query,
      chalk = require('chalk');

module.exports = (state, params, cb) => {
  const data = Object.assign({}, params),
        query = new Query(data.query).andTerm('userId', state.user._id);

  const qs = {};

  qs.where = `(userId eq ${state.user._id})`;
  qs.per_page = data.perPage;
  qs.page = data.page;
  qs.sort = data.sort;

  request({
    url: state.apiUrl('/xandar/user-posts'),
    method: 'GET',
    qs,
    json: true
  }, (err, res, body) => {
    state.posts = body || [];
    state.totalCount = res.headers['x-total-count'];
    state.pageCount = res.headers['x-page-count'];
    state.log.info(`found ${chalk.blue(state.posts.length)} posts`);
    cb(err);
  });
};
