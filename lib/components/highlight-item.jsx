'use strict';

const React = require('react');

module.exports = class HighlightItem extends React.Component {
  render() {
    return (
      <li ariaSelected="false">
        <span className="value" dangerouslySetInnerHTML={{ __html: this.props.value }}></span>
        <span className="separator">{this.props.separator}</span>
        <span className="name">{this.props.name}</span>
      </li>
    );
  }
};
