'use strict';

class Store {
  static set(name, value) {
    return window.localStorage.setItem(name, value);
  }

  static get(name) {
    return window.localStorage.getItem(name);
  }

  static remove(name) {
    return window.localStorage.removeItem(name);
  }

  static clear() {
    return window.localStorage.clear();
  }
}

module.exports = { store: Store };
