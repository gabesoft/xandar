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
      popupOpen: false,
      postItemClass: this.postItemClass()
    };
    this.onFullscreen = this.onFullscreen.bind(this);
    this.onEditTags = this.onEditTags.bind(this);
    this.onTagsChange = this.onTagsChange.bind(this);
    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.onEditTagsMouseEnter = this.onEditTagsMouseEnter.bind(this);
    this.onEditTagsMouseLeave = this.onEditTagsMouseLeave.bind(this);
  }

  postItemClass() {
    return this.props.post._source.read ? 'post-item' : 'post-item unread';
  }

  onHeaderClick() {
    this.setState({ open: !this.state.open });
    this.markAsRead();
  }

  markAsRead() {
    const post = this.props.post;
    const data = post._source;
    // if (!data.read) {
      data.read = true;
      this.setState({ postItemClass: this.postItemClass() });
      actions.savePost(post);
    // }
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
      if (this.state.popupHover) {
        this.closeEditTagsAsync();
      } else {
        this.toggleEditTags(false);
      }
    }, pc.EDIT_TAGS_TIMEOUT);
  }

  onEditTagsMouseEnter() {
    this.setState({ popupHover: true });
  }

  onEditTagsMouseLeave() {
    this.setState({ popupHover: false });
  }

  toggleEditTags(open) {
    this.setState({
      popupClass: open ? 'edit-tags-popup active' : 'edit-tags-popup',
      popupOpen: open,
      popupHover: false
    });
  }

  onFullscreen() {
    this.markAsRead();
    if (this.contentEl) {
      const ref = ReactDOM.findDOMNode(this.contentEl);
      if (ref.requestFullscreen) {
        ref.requestFullscreen();
      } else if (ref.msRequestFullscreen) {
        ref.msRequestFullscreen();
      } else if (ref.mozRequestFullScreen) {
        ref.mozRequestFullScreen();
      } else if (ref.webkitRequestFullscreen) {
        ref.webkitRequestFullscreen();
      }
    }
  }

  onContentClose() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
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
        <TagsInput id={`tags-edit${data._id}`} tags={data._source.tags} onChange={this.onTagsChange}/>
      </div>
    );
  }

  render() {
    const data = this.props.post;
    const post = data._source.post;
    return (
      <li className={this.state.postItemClass}>
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
        <Content
          className="post-content-fullscreen"
          ref={el => this.contentEl = el}
          post={this.props.post}
        />
      </li>
    );
  }
};
