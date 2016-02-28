'use strict';

const React = require('react');
const cls = require('../util').cls;

module.exports = class LangButton extends React.Component {
  render() {
    const className = cls('btn-icon', 'btn-code', this.props.className);
    return (
      <a className={className}>{this.props.lang || 'unknown'}</a>
    );
  }
};
