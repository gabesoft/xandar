const api = require('../api/client'),
      Actions = require('./actions');

class TagActions extends Actions {
  constructor() {
    super({ constants: require('../constants').tags });
    this.generateActions([
      'loadTagsFail',
      'loadTagsDone',
      'deleteTagFail',
      'deleteTagDone',
      'saveTagsFail',
      'saveTagsDone'
    ]);
  }

  loadTags() {
    api.fetchTags()
      .catch(error => this.loadTagsFail({ error }))
      .then(data => this.loadTagsDone({ data }));
  }

  saveTags(tags) {
    api.saveTags(tags)
      .catch(error => this.saveTagsFail({ error }))
      .then(data => this.saveTagsDone({ data }));
  }

  deleteTag(tag) {
    api.deleteTag(tag)
      .catch(error => this.deleteTagFail({ error }))
      .then(data => this.deleteTagDone({ data }));
  }
}

module.exports = new TagActions();
