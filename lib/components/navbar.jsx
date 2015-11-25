const React = require('react');

module.exports = React.createClass({
  propTypes: {},
  render: function render() {
    return (
      <nav>
        <div className="nav-wrapper container">
          <a href="javascript:void(0);" className="brand-logo">Xandar</a>
          <ul id="nav-mobile" className="right hide-on-small-only">
            <li><a href="/logout">{this.props.login}</a></li>
          </ul>
        </div>
      </nav>
    );
  }
});
