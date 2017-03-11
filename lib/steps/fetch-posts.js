'use strict';

const request = require('request'),
      Query = require('../search-query').Query,
      chalk = require('chalk');

module.exports = (state, params, cb) => {
  const data = Object.assign({}, params),
        query = (params.query || { query: '' }).query,
        userQuery = ` (userId eq ${state.user._id})`,
        where = (query ? (query + ' and ') : '') + userQuery;

  const qs = {
    where,
    per_page: data.perPage,
    page: data.page,
    sort: data.sort
  };

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
