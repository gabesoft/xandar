const React = require('react');
const Script = require('./script.jsx');
const Link = require('./link.jsx');

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
          <meta charSet="utf-8"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>{this.props.title}</title>
          <Link assets={this.props.assets} path="main.css"/>
        </head>
        <body>
          <div id="app-mount"
            dangerouslySetInnerHTML={{ __html: this.props.remount }}>
          </div>
          <script id="app-state"
            dangerouslySetInnerHTML={{ __html: this.props.state }}>
          </script>
          <Script assets={this.props.assets} path="app.js" />
        </body>
      </html>
    );
  }
});
