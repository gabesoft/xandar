'use strict';

const React = require('react');

module.exports = class LangInput extends React.Component {
  render() {
    return (
      <input
        className={this.props.className}
        placeholder="type a new language or ESC"
        type="text"
        value=""
      />
    );
  }
};
