const React = require('react');
const Navbar = require('./navbar.jsx');
const Footer = require('./footer.jsx');

module.exports = class App extends React.Component {
  render() {
    const user = this.props.route.user;
    return (
      <div className="app-main">
        <Navbar login={user.meta.login} {...this.props}/>
        <div className="container">
          <div className="row">{this.props.children}</div>
        </div>
        <Footer/>
      </div>
    );
  }
};
