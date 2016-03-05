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

function posts(request, reply) {
  runner
    .init(runnerOptions(request))
    .fetchPosts(request.payload)
    .run(respond(reply, state => state.posts));
}

function postQueries(request, reply) {
  runner
    .init(runnerOptions(request))
    .fetchPostQueries(request.payload)
    .run(respond(reply, state => state.postQueries));
}

function feeds(request, reply) {
  runner
    .init(runnerOptions(request))
    .fetchFeeds()
    .fetchSubscriptions()
    .run(respond(reply, state => {
      return {
        feeds: state.feeds,
        subscriptions: state.subscriptions
      };
    }));
}

function subscriptionTitles(request, reply) {
  runner
    .init(runnerOptions(request))
    .fetchSubscriptions({ fields: ['title', 'feedId'] })
    .populateFeedTitles()
    .run(respond(reply, state => ({ subscriptions: state.subscriptions })));
}

function deleteFeed(request, reply) {
  runner
    .init(runnerOptions(request))
    .fetchSubscriptions({ feedId: request.params.feedId })
    .deleteSubscription()
    .deleteFeed(request.params.feedId)
    .run(respond(reply, state => state.feed));
}

function addFeed(request, reply) {
  const userId = request.auth.credentials.id;

  runner
    .init(runnerOptions(request))
    .findFeed(request.payload.uri)
    .fetchSubscriptions({ userId, noErrors: true })
    .subscribeUser({ userId })
    .run(respond(reply, state => {
      return { feed: state.feed, subscription: state.subscription };
    }));
}

function subscribe(request, reply) {
  runner
    .init(runnerOptions(request))
    .subscribeUser({
      userId: request.auth.credentials.id,
      feedId: request.payload.feedId
    })
    .run(respond(reply, state => state.subscription));
}

function unsubscribe(request, reply) {
  runner
    .init(runnerOptions(request))
    .deleteSubscription({ subscriptionId: request.params.id, soft: true })
    .run(respond(reply, state => state.subscription));
}

function saveSubscription(request, reply) {
  runner
    .init(runnerOptions(request))
    .saveSubscription(request.payload)
    .run(respond(reply, state => state.subscription));
}

function markPostsAsRead(request, reply) {
  runner
    .init(runnerOptions(request))
    .fetchUnreadPosts(request.params.subscriptionId)
    .markPostsAsRead(request.params.subscriptionId)
    .run(respond(reply, state => state.posts));
}

function savePost(request, reply) {
  runner
    .init(runnerOptions(request))
    .savePost(request.payload)
    .run(respond(reply, state => state.post));
}

function savePostQuery(request, reply) {
  runner
    .init(runnerOptions(request))
    .createPostQueryId(request.payload)
    .fetchPostQueries({})
    .savePostQuery(request.payload)
    .run(respond(reply, state => state.postQuery));
}

function fetchTags(request, reply) {
  runner
    .init(runnerOptions(request))
    .fetchTags()
    .run(respond(reply, state => state.tags));
}

function saveTags(request, reply) {
  runner
    .init(runnerOptions(request))
    .saveTags((request.payload || {}).tags || [])
    .fetchTags()
    .run(respond(reply, state => state.tags));
}

function deleteTag(request, reply) {
  runner
    .init(runnerOptions(request))
    .deleteTag(request.params.tag)
    .fetchTags()
    .run(respond(reply, state => state.tags));
}

module.exports = {
  addFeed,
  deleteFeed,
  deleteTag,
  feeds,
  fetchTags,
  markPostsAsRead,
  postQueries,
  posts,
  savePost,
  savePostQuery,
  saveSubscription,
  saveTags,
  subscribe,
  subscriptionTitles,
  unsubscribe
};
