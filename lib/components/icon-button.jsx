const React = require('react');
const Materialize = window.Materialize;

module.exports = class IconButton extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    if (this.props.disabled) {
      return;
    } else if (this.props.onClick) {
      this.props.onClick(event);
    } else {
      Materialize.toast(this.props.title, 1000);
    }
  }

  get className() {
    return 'waves-effect waves-teal btn-flat btn-icon tooltipped';
  }

  render() {
    const cls = [
      this.className,
      this.props.className || '',
      this.props.size || 'small'
    ].join(' ');

    return (
      <a
        className={cls}
        href={this.props.href}
        target={this.props.target}
        disabled={this.props.disabled}
        onClick={this.onClick}>
        <i title={this.props.title} className="material-icons">
          {this.props.icon}
        </i>
      </a>
    );
  }
};
