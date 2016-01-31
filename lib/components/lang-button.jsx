'use strict';

const React = require('react');

module.exports = class LangButton extends React.Component {
  render() {
    const className = `btn-flat btn-icon ${this.props.className}`;
    return (
      <a className={className}>{this.props.lang || 'unknown'}</a>
    );
  }
};
