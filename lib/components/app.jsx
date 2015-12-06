const React = require('react');
const Navbar = require('./navbar.jsx');
const Footer = require('./footer.jsx');
const Link = require('react-router').Link;

module.exports = class App extends React.Component {
  render() {
    const user = this.props.route.user;
    return (
      <div>
        <Navbar login={user.meta.login} {...this.props}/>
        <div className="container">
          <div className="row">{this.props.children}</div>
        </div>
        <Footer/>
      </div>
    );
  }
};
