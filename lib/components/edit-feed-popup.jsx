'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Popup = require('./popup.jsx');
const constants = require('../constants');
const actions = require('../flux/feed-actions');
const dispatcher = require('../flux/dispatcher');
const Button = require('./icon-button.jsx');
const Avatar = require('./text-avatar.jsx');
const Tags = require('./tags-input.jsx');
const genId = require('../util').genId;

module.exports = class EditFeedPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false, top: 0, left: 0 };
    this.close = this.close.bind(this);
    this.onTagsChange = this.onTagsChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onTagsKeyDown = this.onTagsKeyDown.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.id = genId();
  }

  close() {
    const feed = this.state.feed;

    if (feed && feed.subscription) {
      actions.saveSubscription(feed.subscription);
    }

    actions.editFeedPopupClosed({ feed });
    this.setState({ active: false, feed: null });
  }

  onTagsChange(tags) {
    if (this.state.feed) {
      const subscription = this.state.feed.subscription;
      subscription.tags = tags;
      this.setState({ feed: this.state.feed });
    }
  }

  onTitleChange(event) {
    if (this.state.feed) {
      const subscription = this.state.feed.subscription;
      subscription.title = event.target.value;
      this.setState({ feed: this.state.feed });
    }
  }

  onTagsKeyDown(event) {
    if (event.key === 'Tab') {
      this.focusTitleInput();
    }
  }

  onKeyDown(event) {
    if (event.key === 'Enter') {
      this.close();
    }
  }

  focusTitleInput() {
    const el = ReactDOM.findDOMNode(this.titleInput);
    if (el) {
      el.focus();
    }
  }

  componentDidMount() {
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case constants.feeds.SHOW_EDIT_FEED_POPUP:
          this.setState({
            active: true,
            feed: action.feed,
            top: action.rect.top,
            left: action.rect.left
          });
          this.focusTitleInput();
          break;
        case constants.feeds.HIDE_EDIT_FEED_POPUP:
          this.setState({ active: false });
          break;
        default:
          break;
      }
    });
  }

  componentWillUnmount() {
    dispatcher.unregister(this.tokenId);
  }

  render() {
    const feed = this.state.feed || {};
    const subscription = feed.subscription || {};
    const title = subscription.title || feed.title || '';
    const tags = subscription.tags || [];
    const tagsId = `tags-input-${this.id}`;
    const titleId = `title-input-${this.id}`;

    return (
      <Popup
        className="edit-feed-popup"
        active={this.state.active}
        top={this.state.top}
        left={this.state.left}
        onClose={this.close}>
        <div className="header" onClick={this.close}>
          <Avatar text={title} />
          <div className="title">{title.toLowerCase()}</div>
          <div className="actions">
            <Button icon="close" color="red" onClick={this.close} />
          </div>
        </div>
        <div className="content">
          <div className="title">
            <label htmlFor={titleId}>Title</label>
            <input
              ref={el => this.titleInput = el}
              autoFocus
              type="text"
              className="title-input"
              id={titleId}
              value={subscription.title || ''}
              onChange={this.onTitleChange}
              onKeyDown={this.onKeyDown}
            />
          </div>
          <div className="tags">
            <label htmlFor={tagsId}>Tags</label>
            <Tags
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
