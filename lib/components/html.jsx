const React = require('react');
const url = require('url');

module.exports = React.createClass({
  propTypes: {
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

          <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic,800,800italic|Alegreya:400,400italic,700,700italic" rel="stylesheet" type="text/css"/>
        </head>
        <body className={this.props.page + ' ' + this.props.theme}>
          <div className="app-container" id="app-mount"></div>
          <script id="app-state"
            dangerouslySetInnerHTML={{ __html: this.props.state }}>
          </script>
          <script src={url.resolve(assets, 'vendor.js')}></script>
          <script src={url.resolve(assets, 'app.js')}></script>
        </body>
      </html>
    );
  }
});
