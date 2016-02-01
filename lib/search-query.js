'use strict';

function leaf(name, value, type) {
  const query = {};
  query[type] = {};
  query[type][name] = value;
  return query;
}

function is(query, name) {
  return query && (name in query);
}

function isLeaf(query) {
  return is(query, 'term') || is(query, 'match');
}

function isMust(query) {
  return is(query, 'must');
}

function isShould(query) {
  return is(query, 'should');
}

function isMustNot(query) {
  return is(query, 'must_not');
}

function isFilter(query) {
  return is(query, 'filter');
}

function isBool(query) {
  return is(query, 'bool');
}

function isMustOnly(query) {
  return isMust(query)
    && !isShould(query)
    && !isFilter(query)
    && !isMustNot(query);
}

function isMustNotOnly(query) {
  return isMustNot(query)
    && !isShould(query)
    && !isFilter(query)
    && !isMust(query);
}

function isShouldOnly(query) {
  return isShould(query)
    && !isMust(query)
    && !isFilter(query)
    && !isMustNot(query);
}

function checkType(type) {
  if (type !== 'and' && type !== 'or') {
    throw new Error('Invalid type. Expected "and" or "or".');
  }
}

function term(name, value) {
  return leaf(name, value, 'term');
}

function match(name, value) {
  return leaf(name, value, 'match');
}

function must(query) {
  return { must: query };
}

function mustNot(query) {
  return { must_not: query };
}

function should(query) {
  return { should: query };
}

function bool(query) {
  return { bool: query };
}

function compactArray(query, type) {
  if (query.length === 0) {
    return null;
  }
  if (query.length === 1) {
    return query[0];
  }

  const pred = {
    must: isMustOnly,
    should: isShouldOnly,
    must_not: isMustNotOnly
  }[type];

  query = query.reduce((acc, sub) => {
    sub = compact(sub);

    if (isBool(sub) && pred(sub.bool)) {
      sub = sub.bool[type];
    }

    sub = Array.isArray(sub) ? sub : [sub];
    acc = acc.concat(sub);
    return acc;
  }, []);

  return query;
}

function compact(query) {
  if (!query) {
    return null;
  } else if (isLeaf(query)) {
    return query;
  } else if (!isBool(query)) {
    return null;
  }

  let mustq = query.bool.must,
      shouldq = query.bool.should,
      mustnotq = query.bool.must_not;

  const all = [mustq, shouldq, mustnotq].filter(Boolean);

  if (Array.isArray(mustq)) {
    mustq = compactArray(mustq, 'must');
  }

  if (Array.isArray(shouldq)) {
    shouldq = compactArray(shouldq, 'should');
  }

  if (Array.isArray(mustnotq)) {
    mustnotq = compactArray(mustnotq, 'must_not');
  } else {
    mustnotq = compact(mustnotq);
  }

  if (all.length > 1) {
    return bool({ must: mustq, should: shouldq, must_not: mustnotq });
  } else if (mustq) {
    return Array.isArray(mustq) ? bool(must(mustq)) : mustq;
  } else if (shouldq) {
    return Array.isArray(shouldq) ? bool(should(shouldq)) : shouldq;
  } else if (mustnotq) {
    return bool(mustNot(mustnotq));
  }

  return null;
}

module.exports.Query = class SearchQuery {
  constructor(query, sort, skip, limit) {
    this._query = compact(query);
    this._sort = sort;
    this._skip = skip;
    this._limit = limit;
  }

  get query() {
    return this._query;
  }

  get sort() {
    return this._sort;
  }

  get skip() {
    return this._skip;
  }

  get limit() {
    return this._limit;
  }

  get data() {
    return {
      query: this._query || {},
      sort: this._sort,
      limit: this._limit,
      skip: this._skip || 0
    };
  }

  set sort(value) {
    this._sort = value;
  }

  set skip(value) {
    this._skip = value;
  }

  set limit(value) {
    this._limit = value;
  }

  addTerm(name, value, type) {
    this.addQuery(term(name, value), type);
    return this;
  }

  addMatch(name, value, type) {
    this.addQuery(match(name, value), type);
    return this;
  }

  addQuery(query, type) {
    type = type || 'and';
    checkType(type);

    if (!this._query) {
      this._query = compact(query);
    } else {
      const fn = type === 'and' ? must : should;
      this._query = compact(bool(fn([query, this._query])));
    }
    return this;
  }

  andTerm(name, value) {
    return this.addTerm(name, value, 'and');
  }

  andMatch(name, value) {
    return this.addMatch(name, value, 'and');
  }

  andQuery(query) {
    return this.addQuery(query, 'and');
  }

  orTerm(name, value) {
    return this.addTerm(name, value, 'or');
  }

  orMatch(name, value) {
    return this.addMatch(name, value, 'or');
  }

  orQuery(query) {
    return this.addQuery(query, 'or');
  }
};
