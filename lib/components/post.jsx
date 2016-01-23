'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Actions = require('./post-actions.jsx');
const actions = require('../flux/post-actions');
const Content = require('./post-content.jsx');
const pc = require('../constants').posts;
const dispatcher = require('../flux/dispatcher');
const moment = require('moment');
const VelTrans = require('velocity-react/velocity-transition-group');
const TagsInput = require('./tags-input.jsx');

module.exports = class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      popupClass: 'edit-tags-popup',
      popupOpen: false
    };
    this.onFullscreen = this.onFullscreen.bind(this);
    this.onEditTags = this.onEditTags.bind(this);
    this.onTagsChange = this.onTagsChange.bind(this);
    this.onTagsFocus = this.onTagsFocus.bind(this);
    this.onTagsBlur = this.onTagsBlur.bind(this);
    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.onEditTagsMouseEnter = this.onEditTagsMouseEnter.bind(this);
    this.onEditTagsMouseLeave = this.onEditTagsMouseLeave.bind(this);
  }

  postItemClass() {
    const unread = this.props.post._source.read ? '' : 'post-unread';
    const closed = this.props.closed ? 'post-closed' : '';
    const tags = this.props.post._source.tags.map(tag => tag.replace(/^#/, ''));
    return `post-item ${unread} ${closed} ${tags.join(' ')}`;
  }

  onHeaderClick() {
    this.setState({ open: !this.state.open });
    this.markAsRead();
  }

  markAsRead() {
    this.markPostAs(true);
  }

  markAsUnread() {
    this.markPostAs(false);
  }

  markPostAs(read) {
    const post = this.props.post;
    const data = post._source;
    if (data.read !== read) {
      data.read = read;
      actions.savePost(post);
    }
  }

  onTagsChange(tags) {
    const post = this.props.post;
    const data = post._source;
    data.tags = tags;
    actions.savePost(post);
  }

  onEditTags() {
    actions.closeTagPopups(this.props.post._id);
    this.toggleEditTags(!this.state.popupOpen);
    if (!this.state.popupOpen) {
      this.closeEditTagsAsync();
    }
  }

  closeEditTagsAsync() {
    clearTimeout(this.editTagsTimeoutId);
    this.editTagsTimeoutId = setTimeout(() => {
      if (this.state.popupActive) {
        this.closeEditTagsAsync();
      } else {
        this.toggleEditTags(false);
      }
    }, pc.EDIT_TAGS_TIMEOUT);
  }

  onTagsFocus() {
    this.setState({ popupActive: true });
  }

  onTagsBlur() {
    this.setState({ popupActive: false });
  }

  onEditTagsMouseEnter() {
    this.setState({ popupActive: true });
  }

  onEditTagsMouseLeave() {
    this.setState({ popupActive: false });
  }

  toggleEditTags(open) {
    this.setState({
      popupClass: open ? 'edit-tags-popup active' : 'edit-tags-popup',
      popupOpen: open
    });
  }

  onFullscreen() {
    this.markAsRead();
    this.props.onFullscreenClick(this.props.postIndex);
  }

  componentDidMount() {
    this.tokenId = dispatcher.register(action => {
      const data = action.data || {};

      switch (action.type) {
        case pc.CLOSE_TAG_POPUPS:
          if (data.postId !== this.props.post._id) {
            this.toggleEditTags(false);
          }
          break;
        default:
          break;
      }
    });
  }

  componentWillUnmount() {
    clearTimeout(this.editTagsTimeoutId);
    dispatcher.unregister(this.tokenId);
  }

  componentDidUpdate() {
    if (this.props.closed) {
      const el = ReactDOM.findDOMNode(this);
      if (el.scrollIntoViewIfNeeded) {
        el.scrollIntoViewIfNeeded(true);
      } else if (el.scrollIntoViewNeeded) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }

  renderDetails() {
    return (
      <Content className="post-content" post={this.props.post}/>
    );
  }

  renderPopup() {
    const data = this.props.post;
    const post = data._source.post;

    return (
      <div className={this.state.popupClass}
        onMouseEnter={this.onEditTagsMouseEnter}
        onMouseLeave={this.onEditTagsMouseLeave}>
        <div className="title">
          <span className="feed-title">{data._source.title}</span>
          <span className="post-title">{post.title}</span>
        </div>
        <label htmlFor={`tags-edit${data._id}`}>Tags</label>
        <TagsInput
          id={`tags-edit${data._id}`}
          tags={data._source.tags}
          onFocus={this.onTagsFocus}
          onBlur={this.onTagsBlur}
          onChange={this.onTagsChange}
        />
      </div>
    );
  }

  render() {
    const data = this.props.post;
    const post = data._source.post;
    return (
      <li className={this.postItemClass()}>
        <div className="post-header collapsible-header">
          {this.renderPopup()}
          <Actions
            post={this.props.post}
            onFullscreen={this.onFullscreen}
            onEditTags={this.onEditTags}
            className="post-actions"
          />
          <span className="feed-title">{data._source.title}</span>
          <span className="post-title" onClick={this.onHeaderClick}>{post.title}</span>
          <span className="date right">{moment(post.date).fromNow(true)}</span>
        </div>
        <VelTrans enter={{ animation: 'slideDown' }} leave={{ animation: 'slideUp' }} runOnMount>
          {this.state.open ? this.renderDetails() : null}
        </VelTrans>
      </li>
    );
  }
};
