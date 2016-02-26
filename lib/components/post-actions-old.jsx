'use strict';

const React = require('react');
const IconBtn = require('./btn-icon.jsx');

module.exports = class PostActions extends React.Component {
  constructor(props) {
    super(props);
    this.onOpenPost = this.onOpenPost.bind(this);
    this.onEditTags = this.onEditTags.bind(this);
    this.onFullscreen = this.onFullscreen.bind(this);
  }

  onOpenPost(event) {
    event.stopPropagation();
  }

  onEditTags(event) {
    event.stopPropagation();
    this.props.onEditTags(event);
  }

  onFullscreen(event) {
    event.stopPropagation();
    this.props.onFullscreen(event);
  }

  render() {
    const className = this.props.className;
    const data = this.props.post;
    const post = data._source.post;

    return (
      <div className={className}>
        <IconBtn
          icon="open_in_new"
          title="Open post in new window"
          href={post.link}
          onClick={this.onOpenPost}
          target="_blank"
        />
        <IconBtn
          icon="fullscreen"
          title="View in full screen"
          className="fullscreen-icon"
          onClick={this.props.onFullscreen}
        />
        <IconBtn
          icon="loyalty"
          title="Edit tags"
          className="tags-icon"
          onClick={this.props.onEditTags}
        />
      </div>
    );
  }
};
