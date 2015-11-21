const React = require('react');
const Navbar = require('./navbar.jsx');
const Footer = require('./footer.jsx');
const Loader = require('./loader.jsx');
const url = require('url');

module.exports = React.createClass({
  propTypes: {
    remount: React.PropTypes.string.isRequired,
    state: React.PropTypes.string.isRequired,
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

          <link rel="stylesheet" href={url.resolve(assets, 'app.css')}/>
        </head>
        <body>
          <Navbar/>
          <div className="app-container" id="app-mount">
            <Loader/>
          </div>
          <script id="app-state"
            dangerouslySetInnerHTML={{ __html: this.props.state }}>
          </script>
          <script src={url.resolve(assets, 'vendor.js')}></script>
          <script src={url.resolve(assets, 'app.js')}></script>
          <Footer/>
        </body>
      </html>
    );
  }
});
