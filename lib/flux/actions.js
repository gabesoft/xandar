const dispatcher = require('./dispatcher');

module.exports = class Actions {
  constructor(options) {
    this.const = options.constants;
  }

  generateActions(actions) {
    actions.forEach(action => {
      const parts = action.split(/(?=[A-Z])/);
      const key = parts.map(part => part.toUpperCase()).join('_');
      const fail = parts[parts.length - 1] === 'Fail';
      this[action] = data => this.dispatch(key, data, fail);
    });
  }

  dispatch(typeKey, data, fail) {
    data = data || {};

    if (fail && data.xhr && data.xhr.responseJSON) {
      data.error = data.xhr.responseJSON.message;
    } else if (fail) {
      data.error = 'unknown';
    }

    data.type = this.const[typeKey];

    if (data.type) {
      dispatcher.dispatch(data);
    } else {
      throw new Error(`No constant found for type ${typeKey}`);
    }
  }
};
