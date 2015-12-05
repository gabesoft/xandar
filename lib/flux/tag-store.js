const dispatcher = require('./dispatcher'),
      EventEmitter = require('events').EventEmitter,
      tc = require('../tag-constants');

class TagStore extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(tc.MAX_LISTENERS);
    this.state = { tags: new Set([]) };
  }

  getTags() {
    return Array.from(this.state.tags);
  }

  setTags(tags) {
    this.state.tags = new Set(tags);
    this.emit(tc.STORE_CHANGE);
  }

  allSeen(tags) {
    return !this.anyNew(tags);
  }

  anyNew(tags) {
    const set = this.state.tags;
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
