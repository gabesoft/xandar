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
      .then(data => this.loadTagsDone({ data }))
      .catch(error => this.loadTagsFail({ error }));
  }

  saveTags(tags) {
    api.saveTags(tags)
      .then(data => this.saveTagsDone({ data }))
      .catch(error => this.saveTagsFail({ error }));
  }

  deleteTag(tag) {
    api.deleteTag(tag)
      .then(data => this.deleteTagDone({ data }))
      .catch(error => this.deleteTagFail({ error }));
  }
}

module.exports = new TagActions();
