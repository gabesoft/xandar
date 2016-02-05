'use strict';

const React = require('react');
const SidePanel = require('./collapsible-panel.jsx');
const Header = require('./nav-header.jsx');

module.exports = class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }

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
            <span></span>
          </SidePanel>

          <div className="app-content-center"></div>

          <SidePanel className="app-content-right right" direction="-1">
            <span></span>
          </SidePanel>
        </div>

        <div className="app-footer"></div>
      </div>
    );
  }
};
