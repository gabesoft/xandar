'use strict';

module.exports = (state, tags, cb) => {
  state.subscription.tags = tags;
  cb();
};
