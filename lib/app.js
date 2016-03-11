'use strict';

window.$ = window.jQuery = require('jquery');

const React = require('react'),
      ReactDOM = require('react-dom'),
      Router = require('./components/router.jsx'),
      tagActions = require('./flux/tag-actions'),
      router = React.createFactory(Router),
      appMount = document.getElementById('app-mount');

ReactDOM.render(router(window.state), appMount);
tagActions.loadTags();
