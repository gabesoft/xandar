'use strict';

const store = require('./flux/search-store');
const parser = require('./post-query-parser');

function ensureArray(data) {
  return Array.isArray(data) ? data : [data];
}

const converters = class Converters {
  static feed(id) {
    return [{ term: { feedId: id } }];
  }

  static tag(name) {
    return [{ term: { tags: name } }];
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
  // TODO: replace the feed titleId with the real id
  if (Array.isArray(ast)) {
    const left = convert(ast[0]),
          op = ast[1],
          right = convert(ast[2]);
    return filter(converters[op.type](left, right));
  } else {
    return filter(should(converters[ast.type](ast.value)));
  }
}

class Query {
  // properties after created
  // searchQuery
  // sort (date for non text searches, otherwise rank)
  // the end output has to be { query: { filtered: searchQuery } }
  constructor(ast) {
    console.log('QUERY', ast);
    this.ast = ast;
    this.searchQuery = convert(ast);
  }
}

module.exports = {
  Query,
  parse: input => new Query(parser.parse(input))
};
