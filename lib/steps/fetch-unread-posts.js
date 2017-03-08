'use strict';

const request = require('request'),
      Query = require('../search-query').Query,
      chalk = require('chalk');

module.exports = (state, subscriptionId, cb) => {
  const query = [
    `subscriptionId eq ${subscriptionId}`,
    `read eq false` ].join(' and ');

  request({
    url: state.apiUrl('/xandar/user-posts'),
    method: 'GET',
    qs: {
      where: `(${query})`,
      per_page: 10000
    },
    json: true
  }, (err, _, body) => {
    state.posts = body;
    state.postIds = (body || []).map(post => post._id);
    state.log.info(`Found ${chalk.blue((body || []).length)} unread posts`);
    cb(err);
  });
};
