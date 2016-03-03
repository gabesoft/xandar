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
      .fail(xhr => this.subscribeFail({ feed, xhr }))
      .done(subscription => this.subscribeDone({ feed, subscription }));
  }

  unsubscribe(feed) {
    api.unsubscribe(feed.subscription.id)
      .fail(xhr => this.unsubscribeFail({ feed, xhr }))
      .done(subscription => this.unsubscribeDone({ feed, subscription }));
  }

  saveSubscription(subscription) {
    api.saveSubscription(subscription)
      .fail(xhr => this.saveSubscriptionFail({ subscription, xhr }))
      .done(data => this.saveSubscriptionDone({ subscription: data }));
  }

  deleteFeed(feed) {
    api.deleteFeed(feed.id)
      .fail(xhr => this.deleteFeedFail({ feed, xhr }))
      .done(() => this.deleteFeedDone({ feed }));
  }

  loadFeeds() {
    api.feeds()
      .fail(xhr => this.loadFeedsFail({ xhr }))
      .done(data => this.loadFeedsDone({ data }));
  }

  loadPosts(feed) {
    const query = new Query().addTerm('feedId', feed.id);
    query.limit = fc.POST_COUNT;
    query.sort = ct.posts.POST_SORT;

    api.feedPosts(query.data)
      .fail(xhr => this.loadPostsFail({ feed, xhr }))
      .done(posts => this.loadPostsDone({ feed, posts }));
  }

  addFeed(uri) {
    api.addFeed(uri)
      .fail(xhr => this.addFeedFail({ uri, xhr }))
      .done(data => this.addFeedDone({ uri, data }));
  }

  markPostsAsRead(feed) {
    api.markPostsAsRead(feed.subscription)
      .fail(xhr => this.markPostsAsReadFail({ feed, xhr }))
      .done(data => this.markPostsAsReadDone({ feed, data }));
  }
}

module.exports = new FeedActions();
