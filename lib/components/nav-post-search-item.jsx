'use strict';

const React = require('react');

module.exports = class Item extends React.Component {
  render() {
    return (
      <li ariaSelected="false">
        <span className="title" dangerouslySetInnerHTML={{ __html: this.props.title }}/>
        <span className="id" dangerouslySetInnerHTML={{ __html: this.props.id }}/>
        <span className="name" dangerouslySetInnerHTML={{ __html: this.props.name }}/>
      </li>
    );
  }
};
