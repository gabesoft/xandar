'use strict';

const expect = require('chai').expect,
      store = require('../lib/flux/search-store'),
      queries = require('./support/queries.json'),
      Query = require('../lib/search-query'),
      eyes = require('eyes'),
      parse = require('../lib/post-query').parse;

function inspect(obj) {
  eyes.inspect(obj);
}

function printJSON(obj) {
  console.log(JSON.stringify(obj));
}

describe('post query', () => {
  before(() => {
    store.setFeeds({
      subscriptions: [
        { feedId: 123, title: 'Tech News' },
        { feedId: 999, title: 'Javascript Tendencies' },
        { feedId: 732, title: 'CSS Ninja' },
        { feedId: 597, title: 'Hacker News' },
      ]
    });
  });

  const inputs = [
    ['("design" | @tech-news) & #css & :unread', 0, true],
    ['@css-ninja', 1, false],
    [':unread & @tech-news | #javascript', 2, false],
    [':unread & #css | "breaking news"', 3, true],
    ['(:unread & #css) | "breaking news"', 7, true],
    ['"es6 promise"', 4, true],
    ['@tech-news & #css & #javascript & #web', 5, false],
    ['(@css-ninja & "web design") & :unread', 6, true],
    ['"design" & !@hacker-news', 8, true],
    [':unread & !(#a-tag | #b-tag)', 9, false],
    ['!"skip"', 10, true],
    ['!@hacker-news', 11, false],
    ['!#a-tag & !@tech-news', 12, false]
  ];

  const outputs = [
    '(("design" | @tech-news) & (#css & :unread))',
    '@css-ninja',
    '(:unread & (@tech-news | #javascript))',
    '(:unread & (#css | "breaking news"))',
    '((:unread & #css) | "breaking news")',
    '"es6 promise"',
    '(@tech-news & (#css & (#javascript & #web)))',
    '((@css-ninja & "web design") & :unread)',
    '("design" & !@hacker-news)',
    '(:unread & !(#a-tag | #b-tag))',
    '!"skip"',
    '!@hacker-news',
    '(!#a-tag & !@tech-news)'
  ];

  describe('conversion to search query', () => {
    inputs.forEach(input => {
      it(input[0], () => {
        const query = parse(input[0]);
        expect(query.searchQuery).to.deep.equal(queries[input[1]]);
      });
    });
  });

  describe('has text property', () => {
    inputs.forEach(input => {
      it(input[0], () => {
        const query = parse(input[0]);
        expect(query.hasText).to.equal(input[2]);
      });
    });
  });

  describe('toString', () => {
    inputs.forEach((input, index) => {
      it(input[0], () => {
        const query = parse(input[0]);
        expect(query.toString()).to.equal(outputs[index]);
      });
    });
  });
});
