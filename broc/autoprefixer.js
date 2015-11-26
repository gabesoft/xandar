'use strict';

const Filter = require('broccoli-persistent-filter'),
      pick = require('lodash').pick,
      postcss = require('postcss'),
      autoprefixer = require('autoprefixer');

module.exports = class AutoprefixerBuilder extends Filter {
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
    return postcss([ autoprefixer ])
      .process(content)
      .then(result => {
        result.warnings().forEach(warn => {
          console.warn(warn.toString());
        });
        return result.css;
      });
  }

  getDestFilePath(relativePath) {
    return relativePath;
  }
}