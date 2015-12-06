const React = require('react');
const NavSearch = require('./nav-search.jsx');
const Link = require('react-router').Link;

module.exports = React.createClass({
  propTypes: {},
  render: function render() {
    const arrowIcon = <i className="material-icons right">arrow_drop_down</i>;
    const history = this.props.history || { isActive: () => false };
    const feedsClass = history.isActive('/feeds') ? 'active' : '';
    const postsClass = history.isActive('/posts') ? 'active' : '';

    return (
      <nav>
        <ul id="nav-dropdown" className="dropdown-content">
          <li className={feedsClass}><Link to="/feeds">Feeds</Link></li>
          <li className={postsClass}><Link to="/posts">Posts</Link></li>
          <li><a href="/logout">Log Out</a></li>
        </ul>

        <div className="nav-wrapper container">
          <div className="row">
            <NavSearch/>
            <ul id="site-nav" className="right hide-on-small-only">
              <li>
                <a className="dropdown-button" href="javascript:void(0)" data-activates="nav-dropdown">
                  {this.props.login}
                  {this.props.login ? arrowIcon : ''}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});
