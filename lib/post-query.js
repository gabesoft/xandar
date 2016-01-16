'use strict';

const store = require('./flux/search-store');
const parser = require('./post-query-parser');

function ensureArray(data) {
  return Array.isArray(data) ? data : [data];
}

const converters = class Converters {
  static feed(titleId) {
    const id = store.getFeedIdFromTitleId(titleId);
    return [{ term: { feedId: id } }];
  }

  static tag(name) {
    return [{ term: { tags: name } }];
  }

  static flag(name) {
    return [{ term: { read: name === 'read' } }];
  }

  static text(input) {
    return [
      { term: { 'post.title': input } },
      { term: { 'post.description': input } }
    ];
  }

  static andOperator(t1, t2) {
    t1 = ensureArray(t1);
    t2 = ensureArray(t2);
    return { must: t1.concat(t2) };
  }

  static orOperator(t1, t2) {
    t1 = ensureArray(t1);
    t2 = ensureArray(t2);
    return { should: t1.concat(t2) };
  }
};

function should(term) {
  return { should: term };
}

function filter(criteria) {
  return { bool: criteria };
}

function convert(ast) {
  if (Array.isArray(ast) && ast.length === 0) {
    return filter({});
  } else if (Array.isArray(ast)) {
    const left = convert(ast[0]),
          op = ast[1],
          right = convert(ast[2]);
    return filter(converters[op.type](left, right));
  } else {
    return filter(should(converters[ast.type](ast.value)));
  }
}

function hasTextTerm(ast) {
  return Array.isArray(ast) ? ast.some(hasTextTerm) : ast.type === 'text';
}

const printers = class Printers {
  static feed(id) { return `@${id}`; }
  static tag(name) { return `#${name}`; }
  static flag(name) { return `:${name}`; }
  static text(input) { return `"${input}"`; }
  static andOperator() { return '&'; }
  static orOperator() { return '|'; }
};

function print(ast) {
  return Array.isArray(ast) ? `(${ast.map(print).join(' ')})` : printers[ast.type](ast.value);
}

class Query {
  constructor(ast) {
    this.ast = ast;
    this.searchQuery = convert(ast);
    this.hasText = hasTextTerm(ast);
  }

  toString() {
    return print(this.ast);
  }

  getSearchQuery() {
    return this.searchQuery;
  }

  getSearchSort() {
    return [this.hasText ? '_score' : 'post.date:desc'];
  }
}

module.exports = {
  Query,
  parse: input => new Query(input ? parser.parse(input) : [])
};
