'use strict';

const expect = require('chai').expect,
      parse = require('../lib/post-query').parse;

describe('post-query', () => {
  it('parses a query', () => {
    const input = '"design" & #css',
          query = parse(input);

    // TODO: write the query.print function and test the input against the
    //       string output
    console.log(JSON.stringify(query.searchQuery));

    expect(query.searchQuery).to.equal(1);
  });
});
