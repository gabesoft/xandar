'use strict';

const Filter = require('broccoli-persistent-filter'),
      pick = require('lodash').pick,
      uglify = require('uglifycss');

module.exports = class UglifyBuilder extends Filter {
  constructor(inputNode, options) {
    options = options || {};
    options.extensions = options.extensions || [ 'css' ];
    options.targetExtension = options.targetExtension || 'css';

    super(inputNode, pick(options, [
      'cuteComments',
      'expandVars',
      'maxLineLen',
      'uglyComments'
    ]));

    this.options = options;
  }

  processString(content) {
    return uglify.processString(content, this.options);
  }

  getDestFilePath(relativePath) {
    return relativePath;
  }
};
