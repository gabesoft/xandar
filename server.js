'use strict';

require('babel-register')({
  presets: ['react', 'es2015']
});

const Hapi = require('hapi'),
      path = require('path'),
      ReactViews = require('hapi-react-views'),
      Inert = require('inert'),
      Good = require('good'),
      GoodConsole = require('good-console'),
      StatusDecorator = require('http-status-decorator'),
      Vision = require('vision'),
      server = new Hapi.Server({});

server.connection({
  port: 8009
});

server.register([Inert, Vision, StatusDecorator, {
  register: Good,
  options: {
    reporters: [{
      reporter: GoodConsole,
      events: { log: '*', response: '*', error: '*' },
      config: { format: 'hh:mm:ss.SSS' }
    }]
  }
}], err => {
  if (err) {
    console.log(err.stack || err.message);
  }

  server.views({
    engines: { jsx: ReactViews },
    relativeTo: path.join(__dirname, 'lib'),
    path: 'components'
  });

  server.route({
    method: 'GET',
    path: '/lib/app.bundle.js',
    handler: { file: path.join(__dirname, 'lib', 'app.bundle.js') }
  });

  server.route({
    method: 'GET',
    path: '/css/main.css',
    handler: { file: path.join(__dirname, 'css', 'main.css') }
  });

  server.route({
    method: 'GET',
    path: '/node_modules/{path*}',
    handler: (request, reply) => {
      const file = path.join(__dirname, 'node_modules', request.params.path);
      return reply.file(file);
    }
  });

  server.route({
    method: 'GET',
    path: '/{route*}',
    handler: (request, reply) => {
      // TODO: use request.url for the react router

      const state = { data: 'main content' },
            opts = {
              runtimeOptions: {
                doctype: '<!DOCTYPE html>',
                renderMethod: 'renderToString'
              }
            };

      server.render('app', state, opts, (appErr, appOut) => {
        const context = {
          remount: appOut,
          title: 'Blog reader',
          assets: process.env === 'production' ? '/dist' : '//localhost:4200/',
          vendor: '/node_modules',
          state: `window.state = ${JSON.stringify(state)};`
        };

        server.render('html', context, (htmlErr, htmlOut) => {
          console.log('appOut', appErr, appOut);
          console.log('htmlOut', htmlErr, htmlOut);
          reply(htmlOut);
        });
      });
    }
  });

  server.start(startErr => {
    if (startErr) {
      console.log(startErr.stack || startErr.message);
    } else {
      console.log(`server started at ${server.info.uri}`);
    }
  });
});
