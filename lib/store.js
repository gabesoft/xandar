'use strict';

class Store {
  constructor(options) {
    this.prefix = options.prefix || 'prefix-not-set';
  }

  serialize(value, data) {
    return JSON.stringify(Object.assign({ value }, data));
  }

  deserialize(cargo) {
    return JSON.parse(cargo || '{}');
  }

  key(name) {
    return `${this.prefix}-${name}`;
  }

  set(name, value) {
    return window.localStorage.setItem(
      this.key(name),
      this.serialize(value, { timestamp: Date.now() })
    );
  }

  get(name) {
    const cargo = window.localStorage.getItem(this.key(name));
    return this.deserialize(cargo).value;
  }

  remove(name) {
    return window.localStorage.removeItem(this.key(name));
  }

  clear() {
    return window.localStorage.clear();
  }
}

module.exports = { Store };
