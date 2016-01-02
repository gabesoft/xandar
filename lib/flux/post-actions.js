'use strict';

const api = require('../api/client'),
      Actions = require('./actions'),
      ct = require('../constants'),
      pc = ct.posts;

class PostActions extends Actions {
  constructor() {
    super({ constants: pc });
    this.generateActions([
      'loadPostsDone',
      'loadPostsFail',
      'savePostDone',
      'savePostFail'
    ]);
  }

  loadPosts(limit) {
    api.posts(limit)
      .fail(xhr => this.loadPostsFail({ xhr }))
      .done(data => this.loadPostsDone({ data }));
  }

  closeTagPopups(postId) {
    this.dispatch('CLOSE_TAG_POPUPS', { postId });
  }

  savePost(post) {
    api.savePost(post)
      .fail(xhr => this.savePostFail({ post, xhr }))
      .done(data => this.savePostDone({ post: data }));
  }
}

module.exports = new PostActions();
