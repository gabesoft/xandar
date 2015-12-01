'use strict';

window.$ = window.jQuery = require('jquery');
window.Hammer = require('hammerjs');

require('velocity-animate');
require('velocity-animate/velocity.ui');

window.Vel = window.$.Velocity;

require('materialize-css/js/global');
require('materialize-css/js/forms');

require('materialize-css/js/waves');
require('materialize-css/js/toasts');

const React = require('react'),
      ReactDOM = require('react-dom'),
      AppComponent = require('./components/app.jsx'),
      app = React.createFactory(AppComponent),
      mountNode = document.getElementById('app-mount');

ReactDOM.render(app(window.state), mountNode);
