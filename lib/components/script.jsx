const React = require('react');
const path = require('path');

module.exports = React.createClass({
  propTypes: {
    assets: React.PropTypes.string.isRequired
  },
  render: function render() {
    return (
      <script src={path.join(this.props.assets, this.props.path)}></script>
    );
  }
});
