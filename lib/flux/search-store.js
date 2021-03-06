'use strict';

const dispatcher = require('./dispatcher'),
      EventEmitter = require('events').EventEmitter,
      ct = require('../constants'),
      sc = ct.search;

class SearchStore extends EventEmitter {
  constructor() {
    super();

    this.ids = {};
    this.setMaxListeners(ct.STORE_MAX_LISTENERS);
    this.state = {
      feeds: [],
      postQueries: []
    };
  }

  getFeedTitleId(feed) {
    if (!feed.title) { return ''; }

    const baseId = feed.title
            .toLowerCase()
            .trim()
            .replace(/[^0-9A-Za-z]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-/, '')
            .replace(/-$/, '');

    let id = baseId;

    if (this.ids[baseId] && this.ids[baseId] !== feed.feedId) {
      id = `${baseId}-${feed._id.slice(18)}`;
    }

    this.ids[id] = feed.feedId;
    return id;
  }

  getFeedIdFromTitleId(titleId) {
    return this.ids[titleId];
  }

  getFeeds() {
    return this.state.feeds || [];
  }

  getPostQueries() {
    return this.state.postQueries || [];
  }

  setFeeds(data) {
    this.state.feeds = data.subscriptions;
    this.state.feeds.forEach(feed => feed.titleId = feed.titleId || this.getFeedTitleId(feed));
    this.emit(sc.STORE_CHANGE, { type: 'feeds' });
  }

  setPostQueries(data) {
    this.state.postQueries = data;
    this.emit(sc.STORE_CHANGE, { type: 'post-queries' });
  }
}

const store = new SearchStore();

dispatcher.register(action => {
  switch (action.type) {
  case sc.LOAD_FEEDS_DONE:
    store.setFeeds(action.data);
    break;
  case sc.LOAD_POST_QUERIES_DONE:
    store.setPostQueries(action.data);
    break;
  default:
    break;
  }
});

module.exports = store;
