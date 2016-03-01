'use strict';

window.$ = window.jQuery = require('jquery');
window.Hammer = require('hammerjs');

window.Materialize = {};
window.Vel = require('materialize-css/js/velocity.min.js');

require('materialize-css/js/toasts');

const React = require('react'),
      ReactDOM = require('react-dom'),
      Router = require('./components/router.jsx'),
      tagActions = require('./flux/tag-actions'),
      router = React.createFactory(Router),
      toast = require('./toast'),
      appMount = document.getElementById('app-mount');

ReactDOM.render(router(window.state), appMount);
toast.setup();
tagActions.loadTags();
