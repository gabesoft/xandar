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
        opts = {
          url: state.apiUrl('/search/feeds'),
          method: 'POST',
          json: true,
          body: {
            query: { _id: { $in: feedIds } },
            fields: 'title'
          }
        };

  if (feedIds.length === 0) {
    return cb();
  }

  state.log.info(`fetching ${chalk.blue(feedIds.length)} feeds for titles`);
  request(opts, (err, _, feeds) => {
    if (err) {
      cb(err);
    } else if (!feeds || feeds.length === 0) {
      cb(new Error('no feeds found'));
    } else if (feeds.error) {
      cb(feeds.error);
    } else {
      const map = trans(feeds).object('id', 'title').value();
      state.subscriptions.forEach(sub => {
        sub.title = sub.title || map[sub.feedId];
      });
      cb();
    }
  });
};
