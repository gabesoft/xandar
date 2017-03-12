'use strict';

const api = require('../api/client'),
      Actions = require('./actions'),
      constants = require('../constants');

function getSearchQuery(query, page) {
  return {
    query: query || {},
    perPage: constants.posts.POST_COUNT,
    sort: constants.posts.POST_SORT,
    page: page || 1
  };
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
    api.posts(getSearchQuery(postQuery))
      .then(data => this.loadPostsDone({ data }))
      .catch(error => this.loadPostsFail({ error }));
  }

  addPosts(postQuery, page) {
    this.addPostsStart();
    api.posts(getSearchQuery(postQuery, page))
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
