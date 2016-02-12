'use strict';

const dispatcher = require('./dispatcher'),
      EventEmitter = require('events').EventEmitter,
      trans = require('trans'),
      constants = require('../constants');

class PostStore extends EventEmitter {
  constructor() {
    super();

    this.setMaxListeners(constants.STORE_MAX_LISTENERS);
    this.state = { posts: {} };
  }

  getTotalPosts() {
    return this.state.totalPosts;
  }

  getPosts() {
    return trans(this.state.posts)
      .array(null, null)
      .pluck('value')
      .value() || [];
  }

  getPostsCount() {
    return Object.keys(this.state.posts).length;
  }

  hasMore() {
    return this.state.totalPosts > this.getPostsCount();
  }

  setPosts(data) {
    this.state.totalPosts = data.total;
    this.state.posts = trans(data.hits).object('_id', null).value();
    this.emit(constants.posts.STORE_CHANGE, { type: 'posts' });
  }

  addPosts(data) {
    this.state.totalPosts = data.total;
    data.hits.forEach(post => this.state.posts[post._id] = post);
    this.emit(constants.posts.STORE_CHANGE, { type: 'posts' });
  }

  setPost(post) {
    this.state.posts[post._id] = post;
    this.emit(constants.posts.STORE_CHANGE, { post, type: 'post' });
  }
}

const store = new PostStore();

dispatcher.register(action => {
  switch (action.type) {
  case constants.posts.LOAD_POSTS_DONE:
    store.setPosts(action.data);
    break;
  case constants.posts.ADD_POSTS_DONE:
    store.addPosts(action.data);
    break;
  case constants.posts.SAVE_POST_DONE:
    store.setPost(action.data);
    break;
  default:
    break;
  }
});

module.exports = store;
