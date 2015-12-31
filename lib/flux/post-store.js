'use strict';

const dispatcher = require('./dispatcher'),
      EventEmitter = require('events').EventEmitter,
      ct = require('../constants'),
      pc = ct.posts;

class PostStore extends EventEmitter {
  constructor() {
    super();

    this.setMaxListeners(ct.STORE_MAX_LISTENERS);
    this.state = { posts: [] };
  }

  getPosts() {
    return this.state.posts || [];
  }

  setPosts(data) {
    this.state.totalPosts = data.total;
    this.state.posts = data.hits;
    this.emit(pc.STORE_POSTS_CHANGE);
  }
}

const store = new PostStore();

dispatcher.register(action => {
  switch (action.type) {
  case pc.LOAD_POSTS_DONE:
    store.setPosts(action.data);
    break;
  default:
    break;
  }
});

module.exports = store;
