'use strict';

const React = require('react');
const cls = require('../util').cls;

module.exports = class Icon extends React.Component {
  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  onClick(event) {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
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

  render() {
    const className = cls(
      'mdi',
      `mdi-${this.props.name}`,
      this.props.className || '',
      this.props.size || 'small'
    );

    return (
      <i
        className={className}
        onMouseDown={this.onMouseDown}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}>
      </i>
    );
  }
};
