'use strict';

const React = require('react'),
      ReactDOM = require('react-dom'),
      AppComponent = require('./components/app.jsx'),
      app = React.createFactory(AppComponent),
      mountNode = document.getElementById('app-mount');

ReactDOM.render(app(window.state), mountNode);
