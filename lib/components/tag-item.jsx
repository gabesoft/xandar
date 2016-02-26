'use strict';

const React = require('react');
const Button = require('./icon-button.jsx');

module.exports = class TagItem extends React.Component {
  render() {
    return (
      <div key={this.props.key} className="tag-item" props>
        <div className="content">
          <span className="tag-name">{this.props.tag}</span>
          <Button
            icon="delete"
            color="red"
            title="Delete tag"
            size="xsmall"
            onClick={() => this.props.onRemove(this.props.key)}
          />
        </div>
      </div>
    );
  }
};
