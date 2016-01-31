const React = require('react');
const Navbar = require('./navbar.jsx');
const Footer = require('./footer.jsx');
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
        <body>
          <Navbar/>
          <div className="app-container valign-wrapper" id="app-mount">
            <a
              href={this.props.loginUrl}
              className="waves-effect waves-light btn-large valign center-align-block">
              <i className="material-icons left">lock</i>
              Login with Github
            </a>
          </div>
          <Footer/>
        </body>
      </html>
    );
  }
});
