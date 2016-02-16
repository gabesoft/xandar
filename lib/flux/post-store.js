'use strict';

const dispatcher = require('./dispatcher'),
      EventEmitter = require('events').EventEmitter,
      trans = require('trans'),
      constants = require('../constants');

class PostStore extends EventEmitter {
  constructor() {
    super();

    this.setMaxListeners(constants.STORE_MAX_LISTENERS);

    this.posts = {};
    this.postIds = [];
  }

  getTotalPostCount() {
    return this.totalPosts || 0;
  }

  getPosts() {
    return this.postIds.map(id => this.posts[id]);
  }

  getPostById(id) {
    return id ? this.posts[id] : null;
  }

  getPostByIndex(index) {
    return this.getPostById(this.postIds[index]);
  }

  getPostCount() {
    return this.postIds.length;
  }

  hasMore() {
    return this.totalPosts > this.getPostCount();
  }

  setPosts(data) {
    this.totalPosts = data.total;
    this.posts = trans(data.hits).object('_id', null).value();
    this.postIds = data.hits.map(post => post._id);
    this.emit(constants.posts.STORE_CHANGE, { type: 'posts' });
  }

  addPosts(data) {
    this.totalPosts = data.total;
    data.hits.forEach(post => {
      if (!this.posts[post._id]) {
        this.postIds.push(post._id);
      }
      this.posts[post._id] = post;
    });
    this.emit(constants.posts.STORE_CHANGE, { type: 'posts' });
  }

  setPost(post) {
    this.posts[post._id] = post;
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
