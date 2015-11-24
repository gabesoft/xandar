'use strict';

function handler(req, reply) {
  const state = { data: 'main content' };
  const context = {
    title: 'Blog reader',
    assets: reply.conf('app:assets-url'),
    login: req.auth.credentials.meta.login,
    state: `window.state = ${JSON.stringify(state)};`
  };
  const options = {
    runtimeOptions: {
      doctype: '<!DOCTYPE html>',
      renderMethod: 'renderToString'
    }
  };

  reply.view('html', context, options);
}

module.exports = [{
  method: 'GET',
  config: { auth: 'session' },
  path: '/{route*}',
  handler: handler
}, {
  method: 'GET',
  path: '/favicon.ico',
  handler: (req, reply) => reply('TODO: implement')
}];
