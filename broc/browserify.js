'use strict';

const path = require('path'),
      fs = require('fs'),
      pick = require('lodash').pick,
      mkdirp = require('mkdirp'),
      Writer = require('broccoli-caching-writer'),
      RSVP = require('rsvp'),
      browserify = require('browserify');

module.exports = class BrowserifyBuilder extends Writer {
  constructor(options) {
    options = options || {};

    super(options.inputNodes, pick(options, [
      'annotation',
      'cacheExclude',
      'cacheInclude',
      'name',
      'persistentOutput'
    ]));

    this.inputFile = options.inputFile;
    this.outputFile = options.outputFile;
    this.options = options;
  }

  build() {
    const outputPath = path.join(this.outputPath, this.outputFile),
          opts = this.options;

    mkdirp.sync(path.dirname(outputPath));

    return new RSVP.Promise((resolve, reject) => {
      const br = browserify(pick(opts, [ 'debug' ]));

      (opts.require || []).forEach(name => br.require(name));
      (opts.external || []).forEach(name => br.external(name));
      (opts.transforms || []).forEach(tr => br.transform(tr.name, tr.options));

      (opts.entries || []).forEach(name => {
        br.add(path.join(this.inputPaths[0], name));
      });

      br.bundle((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          fs.writeFile(outputPath, buffer, e => e ? reject(e) : resolve());
        }
      });
    });
  }
};
