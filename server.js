'use strict';

require('babel-core/register')({
  presets: ['react', 'es2015']
});

const Hapi = require('hapi'),
      server = new Hapi.Server({}),
      path = require('path'),
      ReactViews = require('hapi-react-views'),
      Inert = require('inert'),
      Vision = require('vision');

server.connection({
  port: 8009
});

server.register([Inert, Vision], err => {
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
    path: '/lib/app.js',
    handler: { file: path.join(__dirname, 'lib', 'app.js') }
  });

  server.route({
    method: 'GET',
    path: '/{route*}',
    handler: (request, reply) => {
      console.log('ROUTE', '/' + (request.params.route || ''));
      console.log('URL', request.url);
      const state = { data: 'app-data' },
            opts = {
              runtimeOptions: {
                doctype: '<!DOCTYPE html>',
                renderMethod: 'renderToString'
              }
            };

      server.render('app', state, opts, (appErr, appOut) => {
        const context = {
          remount: appOut,
          title: 'Feed reader',
          assets: process.env === 'production' ? '/dist' : '/assets',
          state: `window.state = ${JSON.stringify(state)};`
        };

        server.render('html', context, (htmlErr, htmlOut) => {
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
