'use strict';

const Runner = require('srunner').Runner,
      runner = new Runner(),
      path = require('path'),
      url = require('url'),
      uuid = require('node-uuid'),
      conf = require('../../conf/store'),
      states = {};

function authorizeUrl(req) {
  const uri = url.parse(conf.get('github:authorize-url')),
        uid = uuid.v4({ rng: uuid.nodeRNG }),
        redirectUrl = url.parse(conf.get('github:callback'));

  redirectUrl.protocol = req.connection.info.protocol;
  redirectUrl.host = req.info.host;
  redirectUrl.port = req.info.port;
  redirectUrl.query = { redirect: '/' };

  states[uid] = true;

  uri.query = {
    client_id: conf.get('github:client-id'),
    redirect_uri: redirectUrl.format(),
    state: uid
  };

  return uri.format();
}

function login(req, reply) {
  if (req.auth.isAuthenticated) {
    return reply.redirect('/');
  }

  const context = {
    title: 'Xandar Login',
    assets: conf.get('app:assets-url'),
    loginUrl: authorizeUrl(req)
  };
  const options = {
    runtimeOptions: {
      doctype: '<!DOCTYPE html>',
      renderMethod: 'renderToString'
    }
  };

  return reply.view('login', context, options);
}

function logout(req, reply) {
  req.auth.session.clear();
  return reply.redirect('/');
}

function githubCallback(req, reply) {
  const callbackState = req.query.state;

  if (!states[callbackState]) {
    return reply.boom(new Error('Invalid github state'));
  }

  delete states[callbackState];

  const opts = {
    dir: path.join(__dirname, '..', 'steps'),
    state: {
      conf: conf.get.bind(conf)
    }
  };

  runner
    .init(opts)
    .fetchGithubToken({ code: req.query.code, state: callbackState })
    .fetchGithubUser()
    .fetchUser()
    .createUser()
    .run((err, state) => {
      if (err) {
        reply.boom(err);
      } else {
        req.auth.session.set(state.user);
        reply.redirect(req.query.redirect || '/');
      }
    });
}

module.exports = {
  login: login,
  logout: logout,
  githubCallback: githubCallback
};
