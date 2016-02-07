'use strict';

function handler(request, reply) {
  const state = { user: request.auth.credentials };
  const theme = (request.query || {}).theme || 'light';
  const page = request.url.pathname.replace(/\//, '') || 'home';
  const context = {
    title: 'Blog reader',
    assets: reply.conf('app:assets-url'),
    login: request.auth.credentials.meta.login,
    page: `${page}-page`,
    theme: `${theme}-theme`,
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
  handler
}, {
  method: 'GET',
  path: '/favicon.ico',
  handler: (request, reply) => reply('TODO: implement')
}];
