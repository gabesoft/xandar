'use strict';

const store = require('./flux/search-store');
const tagStore = require('./flux/tag-store');
const parser = require('./post-query-parser');

function ensureArray(data) {
  return Array.isArray(data) ? data : [data];
}

const converters = class Converters {
  static feed(titleId) {
    const id = store.getFeedIdFromTitleId(titleId);
    if (!id) {
      throw new Error(`Unknown feed ${titleId}`);
    }
    return [{ term: { feedId: id } }];
  }

  static tag(name) {
    name = (name || '').toLowerCase();

    if (!tagStore.exists(name)) {
      throw new Error('Unknown tag ${name}');
    }

    return [{ term: { tags: name } }];
  }

  static flag(name) {
    name = (name || '').toLowerCase();

    if (name !== 'read' && name !== 'unread') {
      throw new Error(`Unknown flag ${name}`);
    }

    return [{ term: { read: name === 'read' } }];
  }

  static text(input) {
    return [
      { match: { 'post.title': input } },
      { match: { 'post.description': input } }
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

  static notOperator(expr) {
    return { must_not: expr };
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
  } else if (Array.isArray(ast) && ast.length === 2) {
    const op = ast[0],
          expr = convert(ast[1]);
    return filter(converters[op.type](expr));
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
  static notOperator() { return '!'; }
};

function print(ast) {
  const isArray = Array.isArray(ast);

  if (isArray && ast.length === 3) {
    return `(${ast.map(print).join(' ')})`;
  } else if (isArray && ast.length === 2) {
    return `${ast.map(print).join('')}`;
  } else if (ast.type) {
    return printers[ast.type](ast.value);
  } else {
    return '';
  }
}

class Query {
  constructor(ast, searchQuery, userText) {
    this._ast = ast;
    this._searchQuery = searchQuery || convert(ast);
    this._hasText = hasTextTerm(ast);
    this._userText = userText;
  }

  toString() {
    return print(this._ast);
  }

  get searchQuery() {
    return this._searchQuery;
  }

  get hasText() {
    return this._hasText;
  }

  get ast() {
    return this._ast;
  }

  get userText() {
    return this._userText;
  }

  getSearchSort() {
    return [this._hasText ? '_score' : 'post.date:desc'];
  }
}

module.exports = {
  Query,
  parse: input => new Query(input ? parser.parse(input.trim()) : [], null, input)
};
