'use strict';

const React = require('react');
const Button = require('./icon-button.jsx');
const cls = require('../util').cls;

module.exports = class PostItemActions extends React.Component {
  render() {
    const data = this.props.post;
    const post = data._source.post;
    const className = cls('actions', this.props.className);
    const closeButton = (
      <Button
        icon="close"
        color="red"
        onClick={this.props.onClose}
        title="Close post"
      />
    );

    return (
      <div className={className} onClick={event => event.stopPropagation()}>
        {this.props.showClose ? closeButton : null}
        <Button icon="open-in-new" href={post.link} target="_blank" title="Open in new window"/>
        <Button
          icon="view-carousel"
          onClick={this.props.onOpenInCarousel}
          title="Open in carousel view"
        />
        <Button
          icon="tag"
          onClick={this.props.onTagsEdit}
          title="Edit tags"
        />
      </div>
    );
  }
};
