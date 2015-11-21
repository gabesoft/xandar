const React = require('react');

module.exports = React.createClass({
  propTypes: {},
  render: function render() {
    return (
      <div className="row">
        <div className="nav-panel col s12 m3 l3 blue-grey">navigation panel</div>
        <div className="main-content col s12 m9 l9 teal">{this.props.data}</div>
      </div>
    );
  }
});
