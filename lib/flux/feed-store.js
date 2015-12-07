const dispatcher = require('./dispatcher'),
      EventEmitter = require('events').EventEmitter,
      trans = require('trans'),
      ct = require('../constants'),
      fc = ct.feeds;

class FeedStore extends EventEmitter {
  constructor() {
    super();

    this.setMaxListeners(ct.STORE_MAX_LISTENERS);
    this.state = {
      feeds: [],
      posts: {}
    };
  }

  hasPosts(feedId) {
    return this.getPosts(feedId).length > 0;
  }

  findFeed(feedId) {
    return this.state.feeds.findIndex(fd => fd.id === feedId);
  }

  deleteFeed(feedId) {
    const index = this.findFeed(feedId);
    if (index !== -1) {
      this.state.feeds.splice(index, 1);
      this.emit(fc.STORE_FEEDS_CHANGE);
    }
  }

  addFeed(data) {
    const index = this.findFeed(data.feed.id);
    const { feed, subscription } = data;
    if (index === -1) {
      this.state.feeds.unshift(feed);
      feed.subscription = subscription;
    } else {
      this.state.feeds[index].subscription = subscription;
    }
    this.emit(fc.STORE_FEEDS_CHANGE);
  }

  updateSubscription(feedId, subscription) {
    trans(this.state.feeds)
      .filter('id', id => id === feedId)
      .mapf('subscription', () => subscription);
    this.emit(fc.STORE_FEEDS_CHANGE);
  }

  subscriptionCount() {
    return trans(this.state.feeds).filter('subscription', Boolean).count();
  }

  getFeeds() {
    return this.state.feeds || [];
  }

  getPosts(feedId) {
    return this.state.posts[feedId] || [];
  }

  setPosts(posts, feedId) {
    this.state.posts[feedId] = posts;
    this.emit(fc.STORE_POSTS_CHANGE, feedId);
  }

  setFeeds(data) {
    const subscriptions = trans(data.subscriptions).object('feedId').value();
    const feeds = trans(data.feeds)
            .mapff('id', 'subscription', subscriptions)
            .sort('title', 'toLowerCase')
            .value();

    this.state.feeds = feeds;
    this.emit(fc.STORE_FEEDS_CHANGE);
  }
}

const store = new FeedStore();

dispatcher.register(action => {
  switch (action.type) {
  case fc.SUBSCRIBE_DONE:
    store.updateSubscription(action.feed.id, action.subscription);
    break;
  case fc.UNSUBSCRIBE_DONE:
    store.updateSubscription(action.feed.id);
    break;
  case fc.SAVE_SUBSCRIPTION_DONE:
    store.updateSubscription(action.subscription.feedId, action.subscription);
    break;
  case fc.DELETE_DONE:
    store.deleteFeed(action.feed.id);
    break;
  case fc.LOAD_FEEDS_DONE:
    store.setFeeds(action.data);
    break;
  case fc.LOAD_POSTS_DONE:
    store.setPosts(action.posts, action.feed.id);
    break;
  case fc.FIND_FEED_DONE:
    store.addFeed(action.data);
    break;
  default:
    break;
  }
});

module.exports = store;
