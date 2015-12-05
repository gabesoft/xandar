const api = require('../api/client'),
      Actions = require('./actions'),
      fc = require('../feed-constants');

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
      'deleteDone',
      'deleteFail',
      'findFeedDone',
      'findFeedFail',
      'loadFeedsDone',
      'loadFeedsFail',
      'loadPostsDone',
      'loadPostsFail'
    ]);
  }

  subscribe(feed) {
    api.subscribe(feed.id)
      .fail(xhr => this.subscribeFail({feed, xhr}))
      .done(subscription => this.subscribeDone({feed, subscription}));
  }

  unsubscribe(feed) {
    api.unsubscribe(feed.id, feed.subscription.id)
      .fail(xhr => this.unsubscribeFail({feed, xhr}))
      .done(subscription => this.unsubscribeDone({feed, subscription}));
  }

  saveSubscription(subscription) {
    api.saveSubscription(subscription)
      .fail(xhr => this.saveSubscriptionFail({subscription, xhr}))
      .done(data => this.saveSubscriptionDone({subscription: data}));
  }

  deleteFeed(feed) {
    api.deleteFeed(feed.id)
      .fail(xhr => this.deleteFail({feed, xhr}))
      .done(() => this.deleteDone({feed}));
  }

  loadFeeds() {
    api.feeds()
      .fail(xhr => this.loadFeedsFail({xhr}))
      .done(data => this.loadFeedsDone({data}));
  }

  loadPosts(feed) {
    api.feedPosts(feed.id, fc.POST_COUNT)
      .fail(xhr => this.loadPostsFail({feed, xhr}))
      .done(posts => this.loadPostsDone({feed, posts}));
  }

  findFeed(uri) {
    api.findFeed(uri)
      .fail(xhr => this.findFeedFail({uri, xhr}))
      .done(data => this.findFeedDone({uri, data}));
  }
}

module.exports = new FeedActions();
