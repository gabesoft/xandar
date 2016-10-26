'use strict';

const nconf = require('nconf'),
      path = require('path'),
      env = process.env.NODE_ENV || 'development',
      root = process.cwd(),
      configPath = (name) => `${path.join(root, 'config', name)}.json`,
      githubPath = configPath('github'),
      defaultPath = configPath('default');



nconf.overrides({
  env,
  github: require(githubPath),
  path: {
    root,
    config: configPath(env)
  }
});

nconf.env();
nconf.argv();
nconf.file(env, nconf.get('path:config'));
nconf.defaults(require(defaultPath));

module.exports = nconf;
