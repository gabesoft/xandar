'use strict';

const request = require('request'),
      chalk = require('chalk'),
      trans = require('trans');

module.exports = (state, _, cb) => {
  const subscriptions = state.subscriptions || [],
        feedIds = trans(subscriptions)
        .filter('title:invert')
        .pluck('feedId')
        .value(),
        query = `(_id in ${feedIds})`,
        opts = {
          url: state.apiUrl('/xandar/feeds'),
          method: 'GET',
          qs: { where : query, fields: 'title' },
          json: true
        };

  if (feedIds.length === 0) {
    return cb();
  }

  state.log.info(`fetching ${chalk.blue(feedIds.length)} feeds for titles`);
  request(opts, (err, _, feeds) => {
    if (!feeds || feeds.length === 0) {
      state.log.error(new Error('no feeds found'));
    } else if (feeds.error) {
      state.log.error(feeds.error);
    } else {
      const map = trans(feeds).object('id', 'title').value();
      state.subscriptions.forEach(sub => {
        sub.title = sub.title || map[sub.feedId];
      });
    }
    cb(err);
  });
};
