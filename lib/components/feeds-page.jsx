const React = require('react');
const Feeds = require('./feed-list.jsx');
const Search = require('./nav-feed-search.jsx');
const Navbar = require('./navbar.jsx');
const Footer = require('./footer.jsx');

module.exports = class FeedsPage extends React.Component {
  render() {
    const user = this.props.route.user;
    return (
      <div className="app-main">
        <Navbar login={user.meta.login} id="feeds-site-nav" {...this.props}>
          <Search/>
        </Navbar>
        <div className="container">
          <div className="row"><Feeds/></div>
        </div>
        <Footer/>
      </div>
    );
  }
};
