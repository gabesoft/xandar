'use strict';

const nconf = require('nconf'),
      path = require('path'),
      env = process.env.NODE_ENV || 'development',
      root = process.cwd();

nconf.overrides({
  env,
  github: require('./github.json'),
  path: {
    root,
    config: path.join(root, 'config', env) + '.json'
  }
});

nconf.env();
nconf.argv();
nconf.file(env, nconf.get('path:config'));
nconf.defaults(require('./default.json'));

module.exports = nconf;
