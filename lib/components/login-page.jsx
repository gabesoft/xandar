const React = require('react');
const Button = require('./icon-button.jsx');
const url = require('url');

module.exports = class LoginPage extends React.Component {
  render() {
    const assets = this.props.assets;
    const theme = this.props.theme || 'light';
    const className = `login-page ${theme}-theme`;

    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>{this.props.title}</title>
          <link href={url.resolve(assets, 'app.css')} rel="stylesheet" />
        </head>
        <body className={className}>
          <div className="app-container" id="app-mount">
            <h1 className="intro">Hello! Please login to continue ...</h1>
            <Button
              icon="github"
              className="login-button"
              size="xlarge"
              href={this.props.loginUrl}
            />
          </div>
        </body>
      </html>
    );
  }
};
