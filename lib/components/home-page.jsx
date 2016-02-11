'use strict';

const React = require('react');
const SidePanel = require('./collapsible-panel.jsx');
const Header = require('./nav-header.jsx');
const FeedList = require('./feed-list.jsx');
const PostQueryList = require('./post-query-list.jsx');

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
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque imperdiet ipsum eros, quis ultrices ipsum rhoncus nec. Donec non lectus ornare lectus finibus tincidunt nec non ligula. Vestibulum pharetra tellus in leo tempus mollis. Aliquam erat volutpat. Suspendisse eget volutpat nisl, in vehicula mi. Ut eget elit felis. Sed eleifend rutrum arcu nec gravida.
              Nullam facilisis placerat velit. Donec pulvinar tellus in nulla consequat, at egestas diam mattis. Donec faucibus ultrices ligula, et rhoncus orci euismod in. Quisque neque odio, lacinia quis efficitur et, placerat sed massa. Curabitur eget lacus in leo ornare rutrum. Quisque eu posuere augue. Aenean eu magna orci. Ut elementum ex in odio faucibus volutpat. Phasellus turpis magna, posuere in varius vel, tincidunt in ante. Maecenas consequat nibh non luctus blandit. Nullam faucibus suscipit lacinia. Donec eu accumsan lectus. Aliquam a tincidunt tortor. Aenean egestas risus bibendum odio bibendum, nec pretium nisi volutpat.
            </p>
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
