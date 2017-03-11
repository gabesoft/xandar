'use strict';

const crypto = require('crypto');
const parser = require('./post-query-parser');
const store = require('./flux/search-store');
const tagStore = require('./flux/tag-store');

const printers = class Printers {
  static feed(id) { return `@${id}`; }
  static tag(name) { return `#${name}`; }
  static flag(name) { return `:${name}`; }
  static text(input) { return `"${input}"`; }
  static andOperator() { return '&'; }
  static orOperator() { return '|'; }
  static notOperator() { return '!'; }
};

function eq(not) {
  return not ? '~eq' : 'eq';
}

const converters = class Converters {

  static feed(titleId, not) {
    const id = store.getFeedIdFromTitleId(titleId);

    if (!id) {
      throw new Error(`Unknown feed ${titleId}`);
    } else {
      return `(feedId ${eq(not)} ${id})`;
    }
  }

  static tag(rawName, not) {
    const name = (rawName || '').toLowerCase();

    if (!name) {
      throw new Error('Unexpected empty tag');
    } else {
      return `(tags ${eq(not)} "${name}")`;
    }
  }

  static flag(rawName, not) {
    const name = (rawName || '').toLowerCase();

    if (name !== 'read' && name !== 'unread') {
      throw new Error(`Unknown flag ${name}`);
    } else {
      return`(read ${eq(not)} ${name === 'read'})`;
    }
  }

  static text(rawPhrase, not) {
    const op = not ? 'and' : 'or',
          contains = not ? '~contains' : 'contains',
          phrase = `"${rawPhrase}"`;

    return `(post.title ${contains} ${phrase} ${op} post.description:2 ${contains} ${phrase})`;
  }

  static andOperator(t1, t2, not) {
    const e1 = convert(t1, not);
    const e2 = convert(t2, not);
    return not ? `(${e1} or ${e2})` : `(${e1} and ${e2})`;
  }

  static orOperator(t1, t2, not) {
    const e1 = convert(t1, not);
    const e2 = convert(t2, not);
    return not ? `(${e1} and ${e2})` : `(${e1} or ${e2})`;
  }

  static notOperator(t, not) {
    return convert(t, !not);
  }
};

function convert(ast, not) {
  if (!Array.isArray(ast)) {
    return converters[ast.type](ast.value, not);
  }

  if (ast.length === 0) {
    return '';
  }

  if (ast.length === 2) {
    const op = ast[0],
          term = ast[1];
    return converters[op.type](term, not);
  }

  if (ast.length === 3) {
    const left = ast[0],
          op = ast[1],
          right = ast[2];
    return converters[op.type](left, right, not);
  }
}

function astToQuery(ast) {
  return convert(ast, false);
}

function astToText(ast) {
  const isArray = Array.isArray(ast);

  if (isArray && ast.length === 3) {
    return `(${ast.map(astToText).join(' ')})`;
  } else if (isArray && ast.length === 2) {
    return `${ast.map(astToText).join('')}`;
  } else if (ast.type) {
    return printers[ast.type](ast.value);
  } else {
    return '';
  }
}

function mkHash(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

function hasTextTerm(ast) {
  return Array.isArray(ast) ? ast.some(hasTextTerm) : ast.type === 'text';
}

function build(rawInput) {
  const userText = (rawInput || '').trim();
  const ast = userText ? parser.parse(userText) : [];
  const text = astToText(ast);
  return {
    hash: mkHash(text),
    isSearch: hasTextTerm(ast),
    lastUsed: new Date(),
    query: astToQuery(ast),
    text,
    userText
  };
}

module.exports = { build };