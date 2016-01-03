'use strict';

require('babel-register')({
  presets: ['react', 'es2015']
});

const Hapi = require('hapi'),
      path = require('path'),
      glob = require('glob'),
      async = require('async'),
      conf = require('./conf/store'),
      chalk = require('chalk'),
      Logger = require('srunner').Logger,
      log = new Logger(),
      ReactViews = require('hapi-react-views'),
      Auth = require('hapi-auth-cookie'),
      Inert = require('inert'),
      Good = require('good'),
      GoodConsole = require('good-console'),
      StatusDecorator = require('http-status-decorator'),
      Vision = require('vision'),
      server = new Hapi.Server({});

function setupServer(cb) {
  server.connection({
    port: conf.get('app:port') || 8009
  });

  server.path(__dirname);

  server.decorate('request', 'conf', key => conf.get(key));
  server.decorate('reply', 'conf', key => conf.get(key));
  cb();
}

function registerPlugins(cb) {
  server.register([Inert, Vision, Auth, StatusDecorator, {
    register: Good,
    options: {
      reporters: [{
        reporter: GoodConsole,
        events: { log: '*', response: '*', error: '*' },
        config: { format: 'hh:mm:ss.SSS' }
      }]
    }
  }], cb);
}

function setupAuth(cb) {
  server.auth.strategy('session', 'cookie', {
    clearInvalid: true,
    cookie: 'sid',
    isSecure: false,
    password: conf.get('app:auth-secret'),
    redirectTo: '/login'
  });

  cb();
}

function setupViews(cb) {
  server.views({
    engines: { jsx: ReactViews },
    relativeTo: path.join(__dirname, 'lib'),
    path: 'components'
  });

  cb();
}

function setupRoutes(cb) {
  const lib = path.join(conf.get('path:root'), 'lib'),
        opts = {
          nomount: false,
          cwd: lib,
          root: lib
        };

  glob('/**/routes.js', opts, (err, files) => {
    files.forEach(file => {
      let routes = require(file);
      routes = Array.isArray(routes) ? routes : [routes];

      routes.forEach(route => {
        try {
          server.route(route);
          log.info(`added routes from ${file}`);
        } catch (e) {
          log.error(`failed to add routes for ${file}`);
          log.error(e.message);
        }
      });
    });

    cb(err);
  });
}

function startServer(cb) {
  server.start(err => {
    if (!err) {
      log.info(`server started at ${chalk.blue(server.info.uri)}`);
    }
    cb(err);
  });
}

async.series([
  setupServer,
  registerPlugins,
  setupAuth,
  setupViews,
  setupRoutes,
  startServer
], err => {
  if (err) {
    throw err;
  }
});
