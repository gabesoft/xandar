'use strict';

const expect = require('chai').expect,
      store = require('../lib/flux/search-store'),
      tagStore = require('../lib/flux/tag-store'),
      eyes = require('eyes'),
      build = require('../lib/query-builder').build;

const and = ' and ';
const or = ' or ';

function parens(text) {
  return `(${text})`;
}

const data = [
  { userText: '("design" | @tech-news) & #css & :unread',
    text: '(("design" | @tech-news) & (#css & :unread))',
    query: parens([
      '((post.title contains "design" or post.description:2 contains "design") or (feedId eq 123))',
      '((tags eq "css") and (read eq false))'].join(and)),
    isSearch: true },
  { userText: '@css-ninja',
    text: '@css-ninja',
    query: '(feedId eq 732)',
    isSearch: false },
  { userText: ':unread & @tech-news | #javascript',
    text: '(:unread & (@tech-news | #javascript))',
    query: parens([
      '(read eq false)',
      '((feedId eq 123) or (tags eq "javascript"))'
    ].join(and)),
    isSearch: false },
  { userText: ':unread & #css | "breaking news"',
    text: '(:unread & (#css | "breaking news"))',
    query: parens([
      '(read eq false)',
      '((tags eq "css") or (post.title contains "breaking news" or post.description:2 contains "breaking news"))'
    ].join(and)),
    isSearch: true },
  { userText: '(:unread & #css) | "breaking news"',
    text: '((:unread & #css) | "breaking news")',
    query: parens([
      '((read eq false) and (tags eq "css"))',
      '(post.title contains "breaking news" or post.description:2 contains "breaking news")'
    ].join(or)),
    isSearch: true },
  { userText: '"es6 promise"',
    text: '"es6 promise"',
    query: '(post.title contains "es6 promise" or post.description:2 contains "es6 promise")',
    isSearch: true },
  { userText: '@tech-news & #css & #javascript & #web',
    text: '(@tech-news & (#css & (#javascript & #web)))',
    query: parens([
      '(feedId eq 123)',
      '((tags eq "css") and ((tags eq "javascript") and (tags eq "web")))'
    ].join(and)),
    isSearch: false },
  { userText: '(@css-ninja & "web design") & :unread',
    text: '((@css-ninja & "web design") & :unread)',
    query: parens([
      '((feedId eq 732) and (post.title contains "web design" or post.description:2 contains "web design"))',
      '(read eq false)'
    ].join(and)),
    isSearch: true },
  { userText: '"design" & !@hacker-news',
    text: '("design" & !@hacker-news)',
    query: parens([
      '(post.title contains "design" or post.description:2 contains "design")',
      '(feedId ~eq 597)'
    ].join(and)),
    isSearch: true },
  { userText: ':unread & !(#a-tag | #b-tag)',
    text: '(:unread & !(#a-tag | #b-tag))',
    query: '((read eq false) and ((tags ~eq "a-tag") and (tags ~eq "b-tag")))',
    isSearch: false },
  { userText: '!"skip"',
    text: '!"skip"',
    query: '(post.title ~contains "skip" and post.description:2 ~contains "skip")',
    isSearch: true },
  { userText: '!@hacker-news',
    text: '!@hacker-news',
    query: '(feedId ~eq 597)',
    isSearch: false },
  { userText: '!#a-tag & !@tech-news',
    text: '(!#a-tag & !@tech-news)',
    query: '((tags ~eq "a-tag") and (feedId ~eq 123))',
    isSearch: false },
  { userText: ':unread & !(#a-tag | @tech-news) & !(#b-tag & @css-ninja)',
    text: '(:unread & (!(#a-tag | @tech-news) & !(#b-tag & @css-ninja)))',
    query: '((read eq false) and (((tags ~eq "a-tag") and (feedId ~eq 123)) and ((tags ~eq "b-tag") or (feedId ~eq 732))))',
    isSearch: false }
];

describe('query builder', () => {
  before(() => {
    store.setFeeds({
      subscriptions: [
        { id: 'abcd', feedId: 123, title: 'Tech News' },
        { id: '8bcd', feedId: 999, title: 'Javascript Tendencies' },
        { id: '13cd', feedId: 732, title: 'CSS Ninja' },
        { id: '87c3', feedId: 597, title: 'Hacker News' },
      ]
    });
    tagStore.setTags({ tags: ['javascript', 'css', 'web', 'a-tag', 'b-tag'] });
  });

  describe('build query', () => {
    data.forEach(d => {
      it(d.userText, () => {
        const q = build(d.userText);
        expect(q.query).to.equal(d.query);
      });
    });
  });

  describe('build text', () => {
    data.forEach(d => {
      it(d.userText, () => {
        const q = build(d.userText);
        expect(q.text).to.equal(d.text);
      });
    });
  });

  describe('build isSearch', () => {
    data.forEach(d => {
      it(d.userText, () => {
        const q = build(d.userText);
        expect(q.isSearch).to.equal(d.isSearch);
      });
    });
  });
});