'use strict';

const React = require('react');

module.exports = class TagItem extends React.Component {
  render() {
    return (
      <li ariaSelected="false">
        <span className="value" dangerouslySetInnerHTML={{ __html: this.props.value }}></span>
        <i className="material-icons">close</i>
      </li>
    );
  }
};
