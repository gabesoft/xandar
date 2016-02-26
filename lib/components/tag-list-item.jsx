'use strict';

const React = require('react');
const Button = require('./icon-button.jsx');

module.exports = class TagListItem extends React.Component {
  render() {
    return (
      <li ariaSelected="false">
        <span className="value" dangerouslySetInnerHTML={{ __html: this.props.value }}></span>
        <Button icon="delete" color="red" title="Remove tag from typeahead"/>
      </li>
    );
  }
};
