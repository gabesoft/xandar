'use strict';

require('babel-register')({
  presets: ['react', 'es2015']
});

const Hapi = require('hapi'),
      path = require('path'),
      uuid = require('node-uuid'),
      url = require('url'),
      request = require('request'),
      conf = require('./conf/store'),
      ReactViews = require('hapi-react-views'),
      Auth = require('hapi-auth-cookie'),
      Inert = require('inert'),
      Good = require('good'),
      GoodConsole = require('good-console'),
      StatusDecorator = require('http-status-decorator'),
      Vision = require('vision'),
      server = new Hapi.Server({}),
      githubStates = {};

function githubAuthorizeUrl(redirectUri) {
  const uri = url.parse(conf.get('github:authorize-url')),
        uid = uuid.v4({ rng: uuid.nodeRNG });

  githubStates[uid] = true;

  uri.query = {
    client_id: conf.get('github:client-id'),
    redirect_uri: redirectUri,
    state: uid
  };

  return uri.format();
}

server.connection({
  port: conf.get('app:port') || 8009
});

server.register([Inert, Vision, Auth, StatusDecorator, {
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

  server.auth.strategy('session', 'cookie', {
    clearInvalid: true,
    cookie: 'sid',
    isSecure: false,
    password: 'secret', // TODO: get from config
    redirectTo: '/login',
    validateFunc: (req, session, cb) => {
      cb(null, Boolean(session), session);
    }
  });

  server.views({
    engines: { jsx: ReactViews },
    relativeTo: path.join(__dirname, 'lib'),
    path: 'components'
  });

  server.route({
    method: 'GET',
    path: '/favicon.ico',
    handler: (req, reply) => reply('TODO: implement')
  });

  server.route({
    method: 'GET',
    path: '/logout',
    config: { auth: 'session' },
    handler: (req, reply) => {
      req.auth.session.clear();
      reply.redirect('/');
    }
  });

  server.route({
    method: 'GET',
    path: '/login',
    config: {
      auth: { mode: 'try', strategy: 'session' },
      plugins: { 'hapi-auth-cookie': { redirectTo: false } }
    },
    handler: (req, reply) => {
      if (req.auth.isAuthenticated) {
        return reply.redirect('/');
      }

      const redirectUri = url.parse('/github-callback');
      redirectUri.protocol = req.connection.info.protocol;
      redirectUri.host = req.info.host;
      redirectUri.port = req.info.port;
      redirectUri.query = { redirect: '/after-login' };

      const context = {
        title: 'Blog reader',
        assets: conf.get('app:assets-url'),
        loginUrl: githubAuthorizeUrl(redirectUri.format()),
        runtimeOptions: {
          doctype: '<!DOCTYPE html>',
          renderMethod: 'renderToString'
        }
      };

      server.render('login', context, (htmlErr, htmlOut) => htmlErr ? reply(htmlErr) : reply(htmlOut));
    }
  });

  server.route({
    method: 'GET',
    path: '/github-callback',
    config: {
      auth: { mode: 'try', strategy: 'session' },
      plugins: { 'hapi-auth-cookie': { redirectTo: false } }
    },
    handler: (req, reply) => {
      const state = req.query.state;

      if (!githubStates[state]) {
        return reply('Invalid github state');
      }

      delete githubStates[state];

      request({
        url: conf.get('github:token-url'),
        json: true,
        body: {
          client_id: conf.get('github:client-id'),
          client_secret: conf.get('github:client-secret'),
          code: req.query.code,
          state: state
        }
      }, (err, _, body) => {
        if (err || !body.access_token) {
          reply(body);
        } else {
          request({
            url: conf.get('github:user-url'),
            headers: {
              'User-Agent': 'Xandar/0.0.01',
              'Accept': 'application/json',
              'Authorization': `token ${body.access_token}`
            }
          }, (err, _, user) => {
            user = JSON.parse(user);
            req.auth.session.set(user);
            reply.redirect(req.query.redirect || '/');
          });
        }
      });
    }
  });

  server.route({
    method: 'GET',
    config: { auth: 'session' },
    path: '/{route*}',
    handler: (req, reply) => {
      const state = { data: 'main content' };

      console.log('AUTH', req.auth.credentials);

      const context = {
        title: 'Blog reader',
        assets: conf.get('app:assets-url'),
        login: req.auth.credentials.login,
        state: `window.state = ${JSON.stringify(state)};`,
        runtimeOptions: {
          doctype: '<!DOCTYPE html>',
          renderMethod: 'renderToString'
        }
      };

      server.render('html', context, (htmlErr, htmlOut) => htmlErr ? reply(htmlErr) : reply(htmlOut));
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
