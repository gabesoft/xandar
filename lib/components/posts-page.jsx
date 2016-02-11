const React = require('react');
const Posts = require('./post-list-old.jsx');
const PostQueries = require('./post-query-list-old.jsx');
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
          <div className="row">
            <div className="col m4 s12">
              <PostQueries/>
            </div>
            <div className="col m8 s12">
              <Posts/>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
};
