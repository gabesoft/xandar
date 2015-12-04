'use strict';

const path = require('path'),
      url = require('url'),
      Runner = require('srunner').Runner,
      runner = new Runner();

function runnerOptions(request) {
  return {
    dir: path.join(__dirname, '..', 'steps'),
    state: {
      user: request.auth.credentials,
      conf: request.conf,
      apiUrl: pathname => url.resolve(request.conf('api:url'), pathname),
      finderUrl: pathname => url.resolve(request.conf('feed-finder:url'), pathname)
    }
  };
}

function respond(reply, getReply) {
  return (err, state) => {
    if (err) {
      reply.boom(err);
    } else {
      reply(getReply(state));
    }
  };
}

function feeds(request, reply) {
  runner
    .init(runnerOptions(request))
    .fetchFeeds()
    .fetchUserSubscriptions(request.auth.credentials)
    .run(respond(reply, state => {
      return { feeds: state.feeds, subscriptions: state.subscriptions };
    }));
}

function deleteFeed(request, reply) {
  runner
    .init(runnerOptions(request))
    .checkSubscriptions(request.params.feedId)
    .deleteFeed(request.params.feedId)
    .run(respond(reply, state => state.feed));
}

function findFeed(request, reply) {
  const userId = request.auth.credentials.id ;

  runner
    .init(runnerOptions(request))
    .findFeed(request.query.uri)
    .fetchSubscription({ userId, noErrors: true })
    .subscribeUser({ userId })
    .run(respond(reply, state => {
      return { feed: state.feed, subscription: state.subscription };
    }));
}

function posts(request, reply) {
  runner
    .init(runnerOptions(request))
    .fetchPosts(request.query)
    .run(respond(reply, state => state.posts));
}

function subscribe(request, reply) {
  runner
    .init(runnerOptions(request))
    .subscribeUser({
      userId: request.auth.credentials.id,
      feedId: request.params.feedId
    })
    .run(respond(reply, state => state.subscription));
}

function unsubscribe(request, reply) {
  runner
    .init(runnerOptions(request))
    .deleteSubscription(request.params.subscriptionId)
    .run(respond(reply, state => state.subscription));
}

function saveSubscription(request, reply) {
  runner
    .init(runnerOptions(request))
    .saveSubscription(request.payload)
    .run(respond(reply, state => state.subscription));
}

module.exports = {
  deleteFeed: deleteFeed,
  feeds: feeds,
  findFeed: findFeed,
  posts: posts,
  saveSubscription: saveSubscription,
  subscribe: subscribe,
  unsubscribe: unsubscribe
};
