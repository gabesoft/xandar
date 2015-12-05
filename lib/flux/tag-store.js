const dispatcher = require('./dispatcher'),
      EventEmitter = require('events').EventEmitter,
      tc = require('../tag-constants');

class TagStore extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(tc.MAX_LISTENERS);
    this.state = { tags: [] };
  }

  getTags() {
    return this.state.tags;
  }

  setTags(tags) {
    this.state.tags = tags;
    this.emit(tc.STORE_CHANGE);
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
