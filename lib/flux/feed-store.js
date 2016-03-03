const dispatcher = require('./dispatcher'),
      EventEmitter = require('events').EventEmitter,
      trans = require('trans'),
      constants = require('../constants');

class FeedStore extends EventEmitter {
  constructor() {
    super();

    this.setMaxListeners(constants.STORE_MAX_LISTENERS);
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
      this.emit(constants.feeds.STORE_CHANGE, { type: 'feeds' });
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
    this.emit(constants.feeds.STORE_CHANGE, { type: 'feeds' });
  }

  updateReadCount(post) {
    const feedId = post._source.feedId,
          amount = post._source.read ? -1 : +1;

    trans(this.state.feeds)
      .filter('id', id => id === feedId)
      .mapf('subscription.unreadCount', count => count + amount);

    this.emit(constants.feeds.STORE_CHANGE, { type: 'feeds' });
  }

  updateSubscription(feedId, subscription) {
    trans(this.state.feeds)
      .filter('id', id => id === feedId)
      .mapf('subscription', () => subscription);

    this.emit(constants.feeds.STORE_CHANGE, { type: 'feeds' });
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

  setPosts(data, feedId) {
    this.state.posts[feedId] = data.hits.map(post => post._source);
    this.emit(constants.feeds.STORE_CHANGE, { feedId, type: 'posts' });
  }

  setFeeds(data) {
    const subscriptions = trans(data.subscriptions).object('feedId').value();
    const feeds = trans(data.feeds)
            .mapff('id', 'subscription', subscriptions)
            .value();

    function sort(aFeed, bFeed) {
      const aTitle = ((aFeed.subscription || {}).title || aFeed.title).toLowerCase(),
            bTitle = ((bFeed.subscription || {}).title || bFeed.title).toLowerCase();
      return aTitle.localeCompare(bTitle);
    }

    this.state.feeds = feeds.sort(sort);
    this.emit(constants.feeds.STORE_CHANGE, { type: 'feeds' });
  }
}

const store = new FeedStore();

dispatcher.register(action => {
  switch (action.type) {
  case constants.feeds.SUBSCRIBE_DONE:
    store.updateSubscription(action.feed.id, action.subscription);
    break;
  case constants.feeds.UNSUBSCRIBE_DONE:
    store.updateSubscription(action.feed.id);
    break;
  case constants.feeds.SAVE_SUBSCRIPTION_DONE:
    store.updateSubscription(action.subscription.feedId, action.subscription);
    break;
  case constants.feeds.DELETE_FEED_DONE:
    store.deleteFeed(action.feed.id);
    break;
  case constants.feeds.LOAD_FEEDS_DONE:
    store.setFeeds(action.data);
    break;
  case constants.feeds.LOAD_POSTS_DONE:
    store.setPosts(action.posts, action.feed.id);
    break;
  case constants.feeds.ADD_FEED_DONE:
    store.addFeed(action.data);
    break;
  case constants.posts.UPDATE_READ_STATUS:
    store.updateReadCount(action.data);
    break;
  default:
    break;
  }
});

module.exports = store;
