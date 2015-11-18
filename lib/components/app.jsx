const React = require('react');

module.exports = React.createClass({
  propTypes: {},
  render: function render() {
    return (
      <div>
        <div>Main App {this.props.data}</div>
        <div>More stuff here</div>
      </div>
    );
  }
});
