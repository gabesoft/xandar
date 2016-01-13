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
    this.state = { feeds: [] };
  }

  getFeedTitleId(feed) {
    if (!feed.title) { return ''; }

    const id = (feed.title || '')
      .toLowerCase()
      .trim()
      .replace(/[ ,+.'–|»@&#;:]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-/, '')
      .replace(/-$/, '');

    if (this.ids[id] && this.ids[id] !== feed.id) {
      throw new Error(`Feed ${feed.title} causes duplicate id`);
    }

    return id;
  }

  getFeeds() {
    return this.state.feeds || [];
  }

  setFeeds(data) {
    this.state.feeds = data.subscriptions;
    this.state.feeds.forEach(feed => feed.titleId = this.getFeedTitleId(feed));
    this.emit(sc.STORE_FEEDS_CHANGE);
  }
}

const store = new SearchStore();

dispatcher.register(action => {
  switch (action.type) {
  case sc.LOAD_FEEDS_DONE:
    store.setFeeds(action.data);
    break;
  default:
    break;
  }
});

module.exports = store;
