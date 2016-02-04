'use strict';

const React = require('react');

module.exports = class NavHeader extends React.Component {
  render() {
    const user = this.props.user.meta;
    const info = `${user.email} via github, click to logout`;
    return (
      <div className={`${this.props.className} nav-header`}>
        <div className="nav-left">
          <span className="logo">Xandar</span>
        </div>
        <div className="nav-center">

        </div>
        <div className="nav-right">
          <div className="user">
            <img className="user-avatar" alt="" src={user.avatar_url}/>
            <div className="user-info">
              <a href="/logout" title={info}>
                {user.login}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
