'use strict';

const React = require('react');
const Button = require('./icon-button.jsx');

module.exports = class TagItem extends React.Component {
  constructor(props) {
    super(props);
    this.onRemove = this.onRemove.bind(this);
  }

  onRemove() {
    this.props.onRemove(this.props.keyValue);
  }

  render() {
    return (
      <div key={this.props.keyValue} className="tag-item" props>
        <div className="content">
          <span className="tag-name">{this.props.tag}</span>
          <Button
            icon="delete"
            color="red"
            title="Delete tag"
            size="xsmall"
            onClick={this.onRemove}
          />
        </div>
      </div>
    );
  }
};
