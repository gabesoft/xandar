'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Avatar = require('./text-avatar.jsx');
const Date = require('./date.jsx');
const Description = require('./post-description.jsx');
const Icon = require('./icon.jsx');
const Actions = require('./post-item-actions.jsx');
const actions = require('../flux/post-actions');

module.exports = class PostItemOpen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onTagsEdit = this.onTagsEdit.bind(this);
  }

  onTagsEdit(top) {
    const el = top ?
               ReactDOM.findDOMNode(this.refs.avatarTop) :
               ReactDOM.findDOMNode(this.refs.avatarBottom);

    const rect = el.getBoundingClientRect();
    actions.showEditPostPopup({
      rect: { top: rect.top, left: rect.left },
      post: this.props.post
    });
  }

  componentDidMount() {
    this.props.onScrollIntoView(ReactDOM.findDOMNode(this));
  }

  renderActions(className, scroll, top) {
    return (
      <Actions
        showClose
        showViewCarousel
        post={this.props.post}
        className={className}
        onClose={() => this.props.onClose(this.props.post, scroll)}
        onOpenInCarousel={this.props.onOpenInCarousel}
        onTagsEdit={() => this.onTagsEdit(top)}
      />
    );
  }

  renderFeedInfo(avatarRef) {
    const data = this.props.post;
    const feedTitle = data.title;

    return (
      <div className="feed-info">
        <Avatar text={feedTitle} ref={avatarRef} />
        <div className="title">{feedTitle}</div>
      </div>
    );
  }

  renderNav(position) {
    const data = this.props.post;
    const post = data.post;
    const scroll = position !== 'top';
    const top = position === 'top';
    const className = top ? 'header' : 'footer';
    const avatarRef = top ? 'avatarTop' : 'avatarBottom';
    const date = <Date value={post.date} />;
    const end = <Icon name="minus" className="end-icon" />;

    return (
      <div onClick={() => this.props.onClose(data, scroll)} className={className}>
        {this.renderFeedInfo(avatarRef)}
        <div className="title">{post.title}</div>
        {this.renderActions(position, scroll, top)}
        {top ? date : end}
      </div>
    );
  }

  render() {
    return (
      <li className="post-item-detail">
        {this.renderNav('top')}
        <div className="content">
          <Description post={this.props.post} />
        </div>
        {this.renderNav('bottom')}
      </li>
    );
  }
};
