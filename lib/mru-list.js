'use strict';

class MruList {
  constructor(capacity, index, values) {
    this.capacity = Math.max(0, capacity || 100);
    this.index = index || -1;
    this.values = values || [];
    this.checkIndex();
  }

  checkIndex() {
    if (this.values.length === 0) {
      this.index = -1;
    } else if (this.index < 0) {
      this.index = (this.length + (this.index % this.length));
    } else if (this.index >= this.length) {
      this.index = this.index % this.length;
    }
  }

  remove(value) {
    let i = 0;

    for (i = 0; i < this.values.length; i++) {
      if (this.values[i] === value) {
        this.removeAt(i);
      }
    }

    this.checkIndex();
  }

  add(value) {
    if (this.capacity === 0) {
      return;
    } else if (this.index === -1) {
      this.values = [value];
      this.index = 0;
    } else if (this.item !== value) {
      this.remove(value);

      if (this.length === this.capacity) {
        this.removeLru();
      }

      const prefix = this.values.slice(0, this.index);
      const postfix = this.values.slice(this.index);
      this.values = prefix.concat([value].concat(postfix));
    }
  }

  removeAt(index) {
    this.values = this.values.slice(0, index).concat(this.values.slice(index + 1));
  }

  removeLru() {
    const dist = Math.floor(this.values.length / 2);
    const index = (this.index + dist) % this.length;
    this.removeAt(index);
  }

  get length() {
    return this.values.length;
  }

  get item() {
    return this.index === -1 ? null : this.values[this.index];
  }

  get data() {
    return { index: this.index, capacity: this.capacity, values: this.values };
  }

  next() {
    this.index = this.index + 1;
    this.checkIndex();
    return this.item;
  }

  previous() {
    this.index = this.index - 1;
    this.checkIndex();
    return this.item;
  }

  clear() {
    this.index = -1;
    this.values = [];
  }
}

module.exports = {
  MruList,
  make: data => new MruList(data.capacity, data.index, data.values)
};
