'use strict';

const React = require('react');
const cls = require('../util').cls;
const moment = require('moment');

module.exports = class TextAvatar extends React.Component {
  render() {
    const className = cls('date', this.props.className);

    return (
      <div className={className}>
        <span>{moment(this.props.value).fromNow(true)}</span>
      </div>
    );
  }
};
