'use strict';

const expect = require('chai').expect,
      MruList = require('../lib/mru-list').MruList;

describe('MruList', () => {
  let list = null;

  beforeEach(() => {
    list = new MruList(10, -6, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('has the correct capacity', () => {
    expect(list.capacity).to.equal(10);
  });

  it('has the correct index', () => {
    expect(list.index).to.equal(3);
  });

  it('has the correct data', () => {
    expect(list.values).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  describe('add', () => {
    it('adds a new value at the correct index', () => {
      list.add('a');
      expect(list.values).to.eql([0, 1, 2, 'a', 3, 4, 5, 6, 7, 8]);
    });

    it('shrinks the list if the new item would exceed the list capacity', () => {
      list.add('a');
      list.add('b');
      expect(list.values).to.eql([0, 1, 2, 'b', 'a', 3, 4, 5, 6, 8]);
    });

    it('inserts the items in the correct order', () => {
      list.add('a');
      expect(list.values).to.eql([0, 1, 2, 'a', 3, 4, 5, 6, 7, 8]);
      list.add('b');
      expect(list.values).to.eql([0, 1, 2, 'b', 'a', 3, 4, 5, 6, 8]);
      list.add('c');
      expect(list.values).to.eql([0, 1, 2, 'c', 'b', 'a', 3, 4, 5, 8]);
      list.index = 7;
      list.add('x');
      expect(list.values).to.eql([0, 1, 'c', 'b', 'a', 3, 'x', 4, 5, 8]);
      expect(list.item).to.equal('x');
    });

    it('does not do anything if the value to be added equals the current item', () => {
      list.add(3);
      expect(list.values).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('ensures values are unique', () => {
      list.add(7);
      expect(list.values).to.eql([0, 1, 2, 7, 3, 4, 5, 6, 8]);
    });
  });

  describe('item', () => {
    it('returns the item at index', () => {
      expect(list.item).to.equal(3);
    });
  });

  describe('next', () => {
    it('moves the index to the next position', () => {
      list.next();
      expect(list.index).to.equal(4);
    });

    it('wraps around when after reaching the end', () => {
      let i = 0;
      const count = 10;

      for (i = 0; i < count; i++) {
        list.next();
      }

      expect(list.index).to.equal(4);
    });
  });

  describe('previous', () => {
    it('moves the index to the previous position', () => {
      list.previous();
      expect(list.index).to.equal(2);
    });

    it('wraps around after reaching the end', () => {
      let i = 0;
      const count = 10;

      for (i = 0; i < count; i++) {
        list.previous();
      }

      expect(list.index).to.equal(2);
    });
  });
});
