const React = require('react');
const url = require('url');

module.exports = React.createClass({
  propTypes: {
    title: React.PropTypes.string
  },
  render: function render() {
    const assets = this.props.assets;

    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>{this.props.title}</title>
          <link href={url.resolve(assets, 'app.css')} rel="stylesheet" />
        </head>
        <body className="light login-page">
          <div className="app-container" id="app-mount">
            <h1 className="intro">Hello! Please login to continue ...</h1>
            <a href={this.props.loginUrl} className="login-button" title="Login with github">
              <i className="mdi mdi-github-circle"></i>
            </a>
          </div>
        </body>
      </html>
    );
  }
});
