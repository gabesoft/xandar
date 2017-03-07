'use strict';

const React = require('react');
const Popup = require('./popup.jsx');
const constants = require('../constants');
const actions = require('../flux/post-actions');
const dispatcher = require('../flux/dispatcher');
const Avatar = require('./text-avatar.jsx');
const Tags = require('./tags-input.jsx');
const genId = require('../util').genId;
const Button = require('./icon-button.jsx');

module.exports = class EditPostPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false, top: 0, left: 0 };
    this.close = this.close.bind(this);
    this.onTagsChange = this.onTagsChange.bind(this);
    this.id = genId();
  }

  close() {
    const post = this.state.post;
    actions.editPostPopupClosed({ post });
    this.setState({ active: false, post: null });
  }

  onTagsChange(tags) {
    if (this.state.post) {
      const post = this.state.post;
      post.tags = tags;
      this.setState({ post });
      actions.savePost(post);
    }
  }

  componentDidMount() {
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case constants.posts.SHOW_EDIT_POST_POPUP:
          this.setState({
            active: true,
            post: action.post,
            top: action.rect.top,
            left: action.rect.left
          }, () => this.focusTagsInput());
          break;
        case constants.posts.HIDE_EDIT_POST_POPUP:
          this.setState({ active: false });
          break;
        default:
          break;
      }
    });
  }

  focusTagsInput() {
    this.refs.tags.refs.tagsInput.refs.input.focus();
  }

  componentWillUnmount() {
    dispatcher.unregister(this.tokenId);
  }

  render() {
    const data = (this.state.post || {}) || {};
    const tags = data.tags || [];
    const post = data.post || {};
    const feedTitle = data.title;
    const tagsId = `tags-input-${this.id}`;

    return (
      <Popup
        className="edit-post-popup"
        active={this.state.active}
        top={this.state.top}
        left={this.state.left}
        onClose={this.close}>
        <div className="header" onClick={this.close}>
          <div className="feed-info">
            <Avatar text={feedTitle}/>
            <div className="title">{feedTitle}</div>
          </div>
          <div className="title">{post.title}</div>
          <div className="actions">
            <Button icon="close" color="red" onClick={this.close}/>
          </div>
        </div>
        <div className="content">
          <div className="tags">
            <label htmlFor={tagsId}>Tags</label>
            <Tags
              ref="tags"
              className="tags-input"
              id={tagsId}
              tags={tags}
              onChange={this.onTagsChange}
              onKeyDown={this.onTagsKeyDown}
            />
          </div>
        </div>
      </Popup>
    );
  }
};
