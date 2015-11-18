const React = require('react');
const Scripts = require('./scripts.jsx');

module.exports = React.createClass({
  propTypes: {
    remount: React.PropTypes.string.isRequired,
    state: React.PropTypes.string.isRequired,
    title: React.PropTypes.string
  },
  render: function render() {
    return (
      <html>
        <head>
          <title>{this.props.title}</title>
        </head>
        <body>
          <div id="app-mount"
            dangerouslySetInnerHTML={{ __html: this.props.remount }}>
          </div>
          <script id="app-state"
            dangerouslySetInnerHTML={{ __html: this.props.state }}>
          </script>
          <Scripts {...this.props} />
        </body>
      </html>
    );
  }
});
