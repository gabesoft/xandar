'use strict';

const Runner = require('srunner').Runner,
      runner = new Runner(),
      path = require('path'),
      url = require('url'),
      uuid = require('node-uuid'),
      states = {};

function authorizeUrl(request) {
  const uri = url.parse(request.conf('github:authorize-url')),
        uid = uuid.v4({ rng: uuid.nodeRNG }),
        redirectUrl = url.parse(request.conf('github:callback'));

  redirectUrl.protocol = request.connection.info.protocol;
  redirectUrl.host = request.info.host;
  redirectUrl.port = request.info.port;
  redirectUrl.query = { redirect: '/' };

  states[uid] = true;

  uri.query = {
    client_id: request.conf('github:client-id'),
    redirect_uri: redirectUrl.format(),
    state: uid
  };

  return uri.format();
}

function login(request, reply) {
  if (request.auth.isAuthenticated) {
    return reply.redirect('/');
  }

  const context = {
    title: 'Xandar Login',
    assets: request.conf('app:assets-url'),
    loginUrl: authorizeUrl(request, reply)
  };
  const options = {
    runtimeOptions: {
      doctype: '<!DOCTYPE html>',
      renderMethod: 'renderToString'
    }
  };

  return reply.view('login', context, options);
}

function logout(request, reply) {
  request.auth.session.clear();
  return reply.redirect('/');
}

function githubCallback(request, reply) {
  const callbackState = request.query.state;

  if (!states[callbackState]) {
    return reply.boom(new Error('Invalid github state'));
  }

  delete states[callbackState];

  const opts = {
    dir: path.join(__dirname, '..', 'steps'),
    state: {
      conf: request.conf
    }
  };

  runner
    .init(opts)
    .fetchGithubToken({ code: request.query.code, state: callbackState })
    .fetchGithubUser()
    .fetchUser()
    .createUser()
    .run((err, state) => {
      if (err) {
        reply.boom(err);
      } else {
        request.auth.session.set(state.user);
        reply.redirect(request.query.redirect || '/');
      }
    });
}

module.exports = {
  login: login,
  logout: logout,
  githubCallback: githubCallback
};
