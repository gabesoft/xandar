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
      'loadPostsFail'
    ]);
  }

  loadPosts(limit) {
    api.posts(limit)
      .fail(xhr => this.loadPostsFail({ xhr }))
      .done(data => this.loadPostsDone({ data }));
  }
}

module.exports = new PostActions();
