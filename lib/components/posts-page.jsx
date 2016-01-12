const React = require('react');
const Posts = require('./post-list.jsx');
const Search = require('./nav-post-search.jsx');
const Navbar = require('./navbar.jsx');
const Footer = require('./footer.jsx');

module.exports = class FeedsPage extends React.Component {
  render() {
    const user = this.props.route.user;
    return (
      <div className="app-main">
        <Navbar login={user.meta.login} id="posts-site-nav" {...this.props}>
          <Search/>
        </Navbar>
        <div className="container">
          <div className="row"><Posts/></div>
        </div>
        <Footer/>
      </div>
    );
  }
};
