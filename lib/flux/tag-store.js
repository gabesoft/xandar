'use strict';

const dispatcher = require('./dispatcher'),
      EventEmitter = require('events').EventEmitter,
      ct = require('../constants'),
      tc = ct.tags;

class TagStore extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(ct.STORE_MAX_LISTENERS);
    this.tags = new Set([]);
    this.tagsId = null;
  }

  exists(tag) {
    return this.tags.has(tag);
  }

  getTags() {
    return Array.from(this.tags);
  }

  getTagsId() {
    return this.tagsId;
  }

  setTags(data) {
    this.tags = new Set(data.tags);
    this.tagsId = data._id;
    this.emit(tc.STORE_CHANGE);
  }

  allSeen(tags) {
    return !this.anyNew(tags);
  }

  anyNew(tags) {
    const set = this.tags;
    return (tags || []).some(tag => !set.has(tag));
  }
}

const store = new TagStore();

dispatcher.register(action => {
  switch (action.type) {
  case tc.LOAD_TAGS_DONE:
    store.setTags(action.data);
    break;
  case tc.SAVE_TAGS_DONE:
    store.setTags(action.data);
    break;
  case tc.DELETE_TAG_DONE:
    store.setTags(action.data);
    break;
  default:
    break;
  }
});

module.exports = store;
