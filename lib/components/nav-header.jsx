'use strict';

const React = require('react');
const Icon = require('./icon.jsx');

module.exports = class NavHeader extends React.Component {
  constructor(props) {
    super(props);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.state = { text: '' };
  }

  onSearchChange(event) {
    this.setState({ text: event.target.value });
  }

  render() {
    const user = this.props.user.meta;
    const info = `${user.email} via github, click to logout`;
    return (
      <div className={`${this.props.className} nav-header`}>
        <div className="nav-left">
          <div className="search-bar">
            <input
              className="search-input"
              type="search"
              onChange={this.onSearchChange}
            />
            <Icon name="magnify" className="search-icon"/>
          </div>
        </div>

        <div className="nav-center">
          <div className="header-text">{this.state.text}</div>
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
          <Icon name="account-outline" className="user-icon"/>
        </div>
      </div>
    );
  }
};
