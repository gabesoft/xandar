'use strict';

window.$ = window.jQuery = require('jquery');
window.Hammer = require('hammerjs');

require('velocity-animate');
require('velocity-animate/velocity.ui');

window.Vel = window.$.Velocity;

require('materialize-css/js/global');
require('materialize-css/js/jquery.easing.1.3');
require('materialize-css/js/dropdown');
require('materialize-css/js/forms');

require('materialize-css/js/waves');
require('materialize-css/js/toasts');

const React = require('react'),
      ReactDOM = require('react-dom'),
      Router = require('./components/router.jsx'),
      router = React.createFactory(Router),
      toast = require('./toast'),
      appMount = document.getElementById('app-mount');

ReactDOM.render(router(window.state), appMount);
toast.setup();
