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
      'loadFeedsFail',
      'searchNavLoadingStart',
      'searchNavLoadingStop',
      'updateQuerySearch'
    ]);
  }

  loadFeeds() {
    api.feedTitles()
      .fail(xhr => this.loadFeedsFail({ xhr }))
      .done(data => this.loadFeedsDone({ data }));
  }
}

module.exports = new SearchActions();
