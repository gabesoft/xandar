const api = require('../api/client'),
      Actions = require('./actions'),
      Query = require('../search-query').Query,
      ct = require('../constants'),
      fc = ct.feeds;

class FeedActions extends Actions {
  constructor() {
    super({ constants: fc });
    this.generateActions([
      'subscribeDone',
      'subscribeFail',
      'unsubscribeDone',
      'unsubscribeFail',
      'saveSubscriptionDone',
      'saveSubscriptionFail',
      'deleteFeedDone',
      'deleteFeedFail',
      'addFeedDone',
      'addFeedFail',
      'loadFeedsDone',
      'loadFeedsFail',
      'loadPostsDone',
      'loadPostsFail',
      'markPostsAsReadDone',
      'markPostsAsReadFail',
      'showAddFeedPopup',
      'hideAddFeedPopup',
      'showEditFeedPopup',
      'hideEditFeedPopup',
      'showDeleteFeedPopup',
      'hideDeleteFeedPopup',
      'editFeedPopupClosed'
    ]);
  }

  subscribe(feed) {
    api.subscribe(feed.id)
      .catch(error => this.subscribeFail({ feed, error }))
      .then(subscription => this.subscribeDone({ feed, subscription }));
  }

  unsubscribe(feed) {
    api.unsubscribe(feed.subscription.id)
      .catch(error => this.unsubscribeFail({ feed, error }))
      .then(subscription => this.unsubscribeDone({ feed, subscription }));
  }

  saveSubscription(subscription) {
    api.saveSubscription(subscription)
      .catch(error => this.saveSubscriptionFail({ subscription, error }))
      .then(data => this.saveSubscriptionDone({ subscription: data }));
  }

  deleteFeed(feed) {
    api.deleteFeed(feed.id)
      .catch(error => this.deleteFeedFail({ feed, error }))
      .then(() => this.deleteFeedDone({ feed }));
  }

  loadFeeds() {
    api.feeds()
      .catch(error => this.loadFeedsFail({ error }))
      .then(data => this.loadFeedsDone({ data }));
  }

  loadPosts(feed) {
    const query = new Query().addTerm('feedId', feed.id);
    query.limit = fc.POST_COUNT;
    query.sort = ct.posts.POST_SORT;

    api.feedPosts(query.data)
      .catch(error => this.loadPostsFail({ feed, error }))
      .then(posts => this.loadPostsDone({ feed, posts }));
  }

  addFeed(uri) {
    api.addFeed(uri)
      .catch(error => this.addFeedFail({ uri, error }))
      .then(data => this.addFeedDone({ uri, data }));
  }

  markPostsAsRead(feed) {
    api.markPostsAsRead(feed.subscription)
      .catch(error => this.markPostsAsReadFail({ feed, error }))
      .then(data => this.markPostsAsReadDone({ feed, data }));
  }
}

module.exports = new FeedActions();
