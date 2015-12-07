const Actions = require('./actions');

class NavActions extends Actions {
  constructor() {
    super({ constants: require('../constants').nav });
  }

  feedSearch(query) {
    this.dispatch('SEARCH', { query });
  }
}

module.exports = new NavActions();
