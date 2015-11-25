'use strict';

const path = require('path'),
      Runner = require('srunner').Runner,
      runner = new Runner();

function feeds(request, reply) {
  const user = request.auth.credentials,
        opts = {
          dir: path.join(__dirname, '..', 'steps'),
          state: {
            user: user,
            conf: reply.conf
          }
        };

  runner
    .init(opts)
    .fetchFeeds()
    .fetchUserSubscriptions(user)
    .run((err, state) => {
      if (err) {
        reply.boom(err);
      } else {
        reply({ feeds: state.feeds, subscriptions: state.subscriptons });
      }
    });
}

module.exports = {
  feeds: feeds
};
