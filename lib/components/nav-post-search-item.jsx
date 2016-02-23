'use strict';

const React = require('react');
const cls = require('../util').cls;

module.exports = class Item extends React.Component {
  render() {
    const titleClass = cls(
      'title',
      `${this.props.title.toLowerCase()}-category`
    );

    return (
      <li ariaSelected="false">
        <span className="id" dangerouslySetInnerHTML={{ __html: this.props.id }}/>
        <span className={titleClass} dangerouslySetInnerHTML={{ __html: this.props.title }}/>
        <span className="name" dangerouslySetInnerHTML={{ __html: this.props.name }}/>
      </li>
    );
  }
};
