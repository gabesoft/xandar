'use strict';

const dispatcher = require('./dispatcher'),
      EventEmitter = require('events').EventEmitter,
      ct = require('../constants'),
      sc = ct.search;

class SearchStore extends EventEmitter {
  constructor() {
    super();

    this.setMaxListeners(ct.STORE_MAX_LISTENERS);
    this.state = { feeds: [] };
  }

  getFeeds() {
    return this.state.feeds || [];
  }

  setFeeds(data) {
    this.state.feeds = data.subscriptions;
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
