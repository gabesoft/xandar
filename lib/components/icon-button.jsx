'use strict';

const React = require('react');
const Icon = require('./icon.jsx');

module.exports = class IconButton extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    if (this.props.href) {
      event.stopPropagation();
    } else if (this.props.disabled) {
      return;
    } else if (this.props.onClick) {
      this.props.onClick(event);
    } else {
      console.log(this.props.title || this.props.icon);
    }
  }

  render() {
    const size = this.props.size || 'small';
    const color = this.props.color || 'blue';
    const className = `icon-button ${size} ${color}-fg ${this.props.className || ''}`;

    return (
      <a
        className={className}
        disabled={this.props.disabled}
        target={this.props.target}
        href={this.props.href}
        title={this.props.title}
        onClick={this.onClick}>
        <Icon name={this.props.icon}/>
      </a>
    );
  }
};
