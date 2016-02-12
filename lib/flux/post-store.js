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

  getTotalPosts() {
    return this.state.totalPosts;
  }

  getPosts() {
    return this.state.posts || [];
  }

  getPostsCount() {
    return this.getPosts().length;
  }

  hasMore() {
    return this.state.totalPosts > this.getPosts().length;
  }

  setPosts(data) {
    this.state.totalPosts = data.total;
    this.state.posts = data.hits;
    this.emit(pc.STORE_CHANGE, { type: 'posts' });
  }

  addPosts(data) {
    this.state.totalPosts = data.total;
    this.state.posts = this.state.posts.concat(data.hits);
    this.emit(pc.STORE_CHANGE, { type: 'posts' });
  }

  setPost(data) {
    const index = this.state.posts.map(post => post._id).indexOf(data._id);
    if (index !== -1) {
      this.state.posts[index] = data;
      this.emit(pc.STORE_CHANGE, { post: data, type: 'post' });
    }
  }
}

const store = new PostStore();

dispatcher.register(action => {
  switch (action.type) {
  case pc.LOAD_POSTS_DONE:
    store.setPosts(action.data);
    break;
  case pc.ADD_POSTS_DONE:
    store.addPosts(action.data);
    break;
  case pc.SAVE_POST_DONE:
    store.setPost(action.data);
    break;
  default:
    break;
  }
});

module.exports = store;
