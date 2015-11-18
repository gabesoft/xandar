const React = require('react');
const path = require('path');

module.exports = React.createClass({
  propTypes: {},
  render: function render() {
    return (
      <link
        rel={this.props.rel || 'stylesheet'}
        href={path.join(this.props.assets, this.props.path)}/>
    );
  }
});

