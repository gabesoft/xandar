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
      'updateReadStatus',
      'carouselAtTop',
      'carouselAtEnd'
    ]);
  }

  loadPosts(postQuery) {
    this.loadPostsStart();
    api.posts(getSearchQuery(postQuery).data)
      .then(data => this.loadPostsDone({ data }))
      .catch(error => this.loadPostsFail({ error }));
  }

  addPosts(postQuery, skip) {
    this.addPostsStart();
    api.posts(getSearchQuery(postQuery, skip).data)
      .then(data => this.addPostsDone({ data }))
      .catch(error => this.addPostsFail({ error }));
  }

  closeTagPopups(postId) {
    this.dispatch('CLOSE_TAG_POPUPS', { postId });
  }

  savePost(post) {
    api.savePost(post)
      .then(data => this.savePostDone({ data }))
      .catch(error => this.savePostFail({ post, error }));
  }
}

module.exports = new PostActions();
