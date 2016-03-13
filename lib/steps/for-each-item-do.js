'use strict';

const async = require('async');

module.exports = (state, mkRunner, cb) => {
  const total = (state.items || []).length;
  async.forEachOfSeries(state.items || [], (item, index, next) => {
    mkRunner({ item }, index, total).run(err => {
      if (err) {
        state.log.error(err.message);
      }
      next();
    });
  }, cb);
};
