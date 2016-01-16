'use strict';

const api = require('../api/client'),
      Actions = require('./actions'),
      ct = require('../constants'),
      pc = ct.posts;

class PostActions extends Actions {
  constructor() {
    super({ constants: pc });
    this.generateActions([
      'addPostsDone',
      'addPostsFail',
      'loadPostsDone',
      'loadPostsFail',
      'savePostDone',
      'savePostFail'
    ]);
  }

  loadPosts(options) {
    api.posts(options)
      .fail(xhr => this.loadPostsFail({ xhr }))
      .done(data => this.loadPostsDone({ data }));
  }

  addPosts(options) {
    api.posts(options)
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
