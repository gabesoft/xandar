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
      'loadPostQueriesDone',
      'loadPostQueriesFail',
      'savePostQueryDone',
      'savePostQueryFail',
      'searchNavLoadingStart',
      'searchNavLoadingStop',
      'updateQuerySearch',
      'clearQuerySearch',
      'selectPostQuery'
    ]);
  }

  loadFeeds() {
    api.feedTitles()
      .then(data => this.loadFeedsDone({ data }))
      .catch(error => this.loadFeedsFail({ error }));
  }

  loadPostQueries() {
    api.postQueries({ limit: sc.POST_QUERY_COUNT, sort: ['-pin', '-lastUsed'] })
      .then(data => this.loadPostQueriesDone({ data }))
      .catch(error => this.loadPostQueriesFail({ error }));
  }

  savePostQuery(opts) {
    const query = opts.query;

    api.savePostQuery({
      id: query.id,
      title: query.title,
      ast: query.ast,
      data: query.data || query.searchQuery,
      text: query.text || query.toString(),
      userText: query.userText,
      pin: query.pin,
      lastUsed: query.lastUsed
    })
      .then(data => this.savePostQueryDone({ data }))
      .catch(error => this.savePostQueryFail({ error }));
  }
}

module.exports = new SearchActions();
