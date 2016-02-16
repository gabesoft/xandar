'use strict';

const React = require('react');
const getColor = require('../util').getColor;
const getInitials = require('../util').getInitials;
const cls = require('../util').cls;

module.exports = class TextAvatar extends React.Component {
  render() {
    const text = this.props.text;
    const color = getColor(text);
    const className = cls('avatar', `${color}-fg`, this.props.className);

    return (
      <div className={className}>
        <span>{getInitials(text)}</span>
      </div>
    );
  }
};
