'use strict';

const api = require('../api/client'),
      Actions = require('./actions'),
      ct = require('../constants'),
      sc = ct.search;

class SearchActions extends Actions {
  constructor() {
    super({ constants: sc });
    this.generateActions([
      'loadFeedsDone',
      'loadFeedsFail'
    ]);
  }

  loadFeeds() {
    api.feedTitles()
      .fail(xhr => this.loadFeedsFail({ xhr }))
      .done(data => this.loadFeedsDone({ data }));
  }

  updateQuerySearch(query) {
    this.dispatch('QUERY_SEARCH_UPDATE', { query });
  }
}

module.exports = new SearchActions();
