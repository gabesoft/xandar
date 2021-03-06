const api = require('../api/client'),
      Actions = require('./actions'),
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
    api.subscribe(feed._id)
      .then(subscription => this.subscribeDone({ feed, subscription }))
      .catch(error => this.subscribeFail({ feed, error }));
  }

  unsubscribe(feed) {
    api.unsubscribe(feed.subscription._id)
      .then(subscription => this.unsubscribeDone({ feed, subscription }))
      .catch(error => this.unsubscribeFail({ feed, error }));
  }

  saveSubscription(subscription) {
    api.saveSubscription(subscription)
      .then(data => this.saveSubscriptionDone({ subscription: data }))
      .catch(error => this.saveSubscriptionFail({ subscription, error }));
  }

  deleteFeed(feed) {
    api.deleteFeed(feed._id)
      .then(() => this.deleteFeedDone({ feed }))
      .catch(error => this.deleteFeedFail({ feed, error }));
  }

  loadFeeds() {
    api.feeds()
      .then(data => this.loadFeedsDone({ data }))
      .catch(error => this.loadFeedsFail({ error }));
  }

  addFeed(uri) {
    api.addFeed(uri)
      .then(data => this.addFeedDone({ uri, data }))
      .catch(error => this.addFeedFail({ uri, error }));
  }

  markPostsAsRead(feed) {
    api.markPostsAsRead(feed.subscription)
      .then(data => this.markPostsAsReadDone({ feed, data }))
      .catch(error => this.markPostsAsReadFail({ feed, error }));
  }
}

module.exports = new FeedActions();
