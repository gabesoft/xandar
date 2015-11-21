'use strict';

const Filter = require('broccoli-persistent-filter'),
      pick = require('lodash').pick,
      uglify = require('uglify-js');

module.exports = class UglifyBuilder extends Filter {
  constructor(inputNode, options) {
    options = options || {};
    options.extensions = options.extensions || [ 'js' ];
    options.targetExtension = options.targetExtension || 'js';

    super(inputNode, pick(options, [
      'annotation',
      'extensions',
      'inputEncoding',
      'name',
      'outputEncoding',
      'targetExtension'
    ]));
  }

  processString(content) {
    return uglify.minify(content, { fromString: true }).code;
  }

  getDestFilePath(relativePath) {
    return relativePath;
  }
};
