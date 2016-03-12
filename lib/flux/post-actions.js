'use strict';

const api = require('../api/client'),
      Actions = require('./actions'),
      Query = require('../search-query').Query,
      constants = require('../constants');

function getSearchQuery(postQuery, skip) {
  postQuery = postQuery || {};

  const searchQuery = new Query(postQuery.data || postQuery.searchQuery);

  searchQuery.limit = constants.posts.POST_COUNT;
  searchQuery.sort = constants.posts.POST_SORT;
  searchQuery.skip = skip || 0;

  return searchQuery;
}

class PostActions extends Actions {
  constructor() {
    super({ constants: constants.posts });
    this.generateActions([
      'addPostsStart',
      'addPostsDone',
      'addPostsFail',
      'loadPostsStart',
      'loadPostsDone',
      'loadPostsFail',
      'savePostDone',
      'savePostFail',
      'showEditPostPopup',
      'hideEditPostPopup',
      'editPostPopupClosed',
      'updateReadStatus'
    ]);
  }

  loadPosts(postQuery) {
    this.loadPostsStart();
    api.posts(getSearchQuery(postQuery).data)
      .catch(error => this.loadPostsFail({ error }))
      .then(data => this.loadPostsDone({ data }));
  }

  addPosts(postQuery, skip) {
    this.addPostsStart();
    api.posts(getSearchQuery(postQuery, skip).data)
      .catch(error => this.addPostsFail({ error }))
      .then(data => this.addPostsDone({ data }));
  }

  closeTagPopups(postId) {
    this.dispatch('CLOSE_TAG_POPUPS', { postId });
  }

  savePost(post) {
    api.savePost(post)
      .catch(error => this.savePostFail({ post, error }))
      .then(data => this.savePostDone({ data }));
  }
}

module.exports = new PostActions();
