const React = require('react');

module.exports = React.createClass({
  propTypes: {},
  render: function render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <a href="#" className="brand-logo">Xandar</a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><a href="menu.html">menu</a></li>
          </ul>
        </div>
      </nav>
    );
  }
});
