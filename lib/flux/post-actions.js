'use strict';

const api = require('../api/client'),
      Actions = require('./actions'),
      Query = require('../search-query').Query,
      ct = require('../constants'),
      pc = ct.posts;

function getSearchQuery(postQuery, skip) {
  postQuery = postQuery || {};

  const searchQuery = new Query(postQuery.data || postQuery.searchQuery);

  searchQuery.limit = pc.POST_COUNT;
  searchQuery.sort = pc.POST_SORT;
  searchQuery.skip = skip || 0;

  return searchQuery;
}

class PostActions extends Actions {
  constructor() {
    super({ constants: pc });
    this.generateActions([
      'addPostsStart',
      'addPostsDone',
      'addPostsFail',
      'loadPostsStart',
      'loadPostsDone',
      'loadPostsFail',
      'savePostDone',
      'savePostFail',
      'updateReadStatus'
    ]);
  }

  loadPosts(postQuery) {
    this.loadPostsStart();
    api.posts(getSearchQuery(postQuery).data)
      .fail(xhr => this.loadPostsFail({ xhr }))
      .done(data => this.loadPostsDone({ data }));
  }

  addPosts(postQuery, skip) {
    this.addPostsStart();
    api.posts(getSearchQuery(postQuery, skip).data)
      .fail(xhr => this.addPostsFail({ xhr }))
      .done(data => this.addPostsDone({ data }));
  }

  closeTagPopups(postId) {
    this.dispatch('CLOSE_TAG_POPUPS', { postId });
  }

  savePost(post) {
    api.savePost(post)
      .fail(xhr => this.savePostFail({ post, xhr }))
      .done(data => this.savePostDone({ data }));
  }
}

module.exports = new PostActions();
