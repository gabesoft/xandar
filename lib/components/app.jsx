const React = require('react');

module.exports = class App extends React.Component {
  render() {
    return this.props.children;
  }
};
