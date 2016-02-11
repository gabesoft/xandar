'use strict';

const React = require('react');
const SidePanel = require('./collapsible-panel.jsx');
const Header = require('./nav-header.jsx');
const FeedList = require('./feed-list.jsx');
const PostQueryList = require('./post-query-list.jsx');
const PostList = require('./post-list.jsx');

module.exports = class HomePage extends React.Component {
  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const user = this.props.route.user;

    return (
      <div className="app-main">
        <input hidden value={user.id} readOnly/>
        <Header className="app-header" user={user}/>

        <div className="app-content">
          <SidePanel className="app-content-left left" direction="1">
            <FeedList/>
          </SidePanel>

          <div className="app-content-center">
            <PostList/>
          </div>

          <SidePanel className="app-content-right right" direction="-1">
            <PostQueryList/>
          </SidePanel>
        </div>

        <div className="app-footer"></div>
      </div>
    );
  }
};
