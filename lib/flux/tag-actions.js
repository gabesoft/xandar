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
      .fail(xhr => this.loadTagsFail({ xhr }))
      .done(data => this.loadTagsDone({ data }));
  }

  saveTags(tags) {
    api.saveTags(tags)
      .fail(xhr => this.saveTagsFail({ xhr }))
      .done(data => this.saveTagsDone({ data }));
  }

  deleteTag(tag) {
    api.deleteTag(tag)
      .fail(xhr => this.deleteTagFail({ xhr }))
      .done(data => this.deleteTagDone({ data }));
  }
}

module.exports = new TagActions();
