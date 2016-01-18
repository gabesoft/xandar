'use strict';

const expect = require('chai').expect,
      store = require('../lib/flux/search-store'),
      queries = require('./support/queries.json'),
      eyes = require('eyes'),
      Query = require('../lib/search-query').Query;

function inspect(obj) {
  eyes.inspect(obj);
}

function printJSON(obj) {
  console.log(JSON.stringify(obj));
}

function bool(query) {
  return { bool: query };
}

function must(query) {
  return { must: query };
}

function should(query) {
  return { should: query };
}

function term(name, value) {
  const query = {};
  query[name] = value;
  return { term: query };
}

function match(name, value) {
  const query = {};
  query[name] = value;
  return { match: query };
}

describe('search query', () => {
  it('compacts boolean "should" queries with a single term', () => {
    const query = new Query(bool(should([term('a', 1)])));
    expect(query._query).to.deep.equal({ term: { a: 1 } });
  });

  it('compacts boolean "must" queries with a single term', () => {
    const query = new Query(bool(must([term('a', 1)])));
    expect(query._query).to.deep.equal({ term: { a: 1 } });
  });

  it('pulls up boolean sub queries with one leaf', () => {
    const data = bool(must([term('a', 1), bool(should([term('b', 2)]))])),
          query = new Query(data);
    expect(query._query).to.deep.equal({
      bool: {
        must: [{ term: { a: 1 } }, { term: { b: 2 } }]
      }
    });
  });

  it('does not merge boolean sub queries of different types', () => {
    const shouldq = should([term('b', 1), term('c', 2)]),
          mustq = must([term('a', 1), bool(shouldq)]),
          data = bool(mustq),
          query = new Query(data);
    expect(query._query).to.deep.equal({
      bool: {
        must: [
          { term: { a: 1 } },
          { bool: { should: [{ term: { b: 1 } }, { term: { c: 2 } }] } }
        ]
      }
    });
  });

  it('adds a sub query to a leaf query via and', () => {
    const query = new Query(bool(should(term('a', 1))))
            .andQuery(bool(must([term('b', 2), match('c', 'x')])));
    expect(query._query).to.deep.equal({
      bool: {
        must: [
          { term: { b: 2 } },
          { match: { c: 'x' } },
          { term: { a: 1 } },
        ]
      }
    });
  });

  it('adds a sub query to a leaf query via or', () => {
    const query = new Query(term('a', 1)).orQuery(bool(must([term('b', 2), term('c', 3)])));
    expect(query._query).to.deep.equal({
      bool: {
        should: [
          { bool:
            {
              must: [{ term: { b: 2 } }, { term: { c: 3 } }]
            }
          },
          { term: { a: 1 } }
        ]
      }
    });
  });

  it('adds a term to a composite query via and', () => {
    const query = new Query(bool(should([term('a', 1), term('b', 2)])))
            .andQuery(bool(must([term('c', 2), match('d', 'x')])));
    expect(query._query).to.deep.equal({
      bool: {
        must: [
          { term: { c: 2 } },
          { match: { d: 'x' } },
          { bool: { should: [{ term: { a: 1 } }, { term: { b: 2 } }] } }
        ]
      }
    });
  });

  it('adds a sub query to a leaf query via or', () => {
    const query = new Query(bool(must([term('a', 1), term('b', 2)])))
            .orQuery(bool(must([term('c', 1), term('d', 2)])))
            .orQuery(bool(should([term('x', 1)])));
    expect(query._query).to.deep.equal({
      bool: {
        should: [
          { term: { x: 1 } },
          { bool: { must: [{ term: { c: 1 } }, { term: { d: 2 } }] } },
          { bool: { must: [{ term: { a: 1 } }, { term: { b: 2 } }] } }
        ]
      }
    });
  });

  it('adds a term to an empty query via and', () => {
    const query = new Query().andTerm('a', 1);
    expect(query._query).to.deep.equal({ term: { a: 1 } });
  });

  it('adds a term to an empty query via or', () => {
    const query = new Query().orTerm('a', 1);
    expect(query._query).to.deep.equal({ term: { a: 1 } });
  });
});
