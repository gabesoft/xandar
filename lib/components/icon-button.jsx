const React = require('react');
const Materialize = window.Materialize;

module.exports = React.createClass({
  onClick() {
    Materialize.toast(this.props.title, 1000);
  },

  get className() {
    return 'waves-effect waves-teal btn-flat btn-icon tooltipped';
  },

  render() {
    return (
      <a
        className={`${this.className} ${this.props.className}`}
        onClick={this.props.onClick || this.onClick}>
        <i title={this.props.title} className="small material-icons">
          {this.props.icon}
        </i>
      </a>
    );
  }
});
