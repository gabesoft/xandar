'use strict';

const api = require('../api/client'),
      Actions = require('./actions'),
      Query = require('../search-query').Query,
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

  loadPosts(postQuery) {
    const query = new Query((postQuery || {}).searchQuery);
    query.limit = pc.POST_COUNT;
    query.sort = pc.POST_SORT;

    api.posts(query.data)
      .fail(xhr => this.loadPostsFail({ xhr }))
      .done(data => this.loadPostsDone({ data }));
  }

  addPosts(postQuery, skip) {
    const query = new Query((postQuery || {}).searchQuery);
    query.skip = skip;
    query.limit = pc.POST_COUNT;
    query.sort = pc.POST_SORT;

    api.posts(query.data)
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
