'use strict';

const React = require('react');
const Icon = require('./icon.jsx');

module.exports = class IconButton extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  onMouseDown(event) {
    if (this.props.onMouseDown) {
      this.props.onMouseDown(event);
    }
  }

  onDoubleClick(event) {
    if (this.props.onDoubleClick) {
      this.props.onDoubleClick(event);
    }
  }

  onClick(event) {
    if (this.props.href) {
      event.stopPropagation();
    } else if (this.props.onClick && !this.props.disabled) {
      this.props.onClick(event);
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
        onDoubleClick={this.onDoubleClick}
        onMouseDown={this.onMouseDown}
        onClick={this.onClick}>
        <Icon name={this.props.icon}/>
      </a>
    );
  }
};
