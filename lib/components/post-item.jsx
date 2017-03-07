'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Avatar = require('./text-avatar.jsx');
const Date = require('./date.jsx');
const cls = require('../util').cls;
const actions = require('../flux/post-actions');
const Actions = require('./post-item-actions.jsx');

module.exports = class PostItemClosed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onTagsEdit = this.onTagsEdit.bind(this);
  }

  onTagsEdit() {
    const el = ReactDOM.findDOMNode(this.refs.avatar);
    const rect = el.getBoundingClientRect();
    actions.showEditPostPopup({
      rect: { top: rect.top, left: rect.left },
      post: this.props.post
    });
  }

  componentDidMount() {
    if (this.props.scroll) {
      this.props.onScrollIntoView(ReactDOM.findDOMNode(this));
    }
  }

  render() {
    const data = this.props.post;
    const post = data.post;
    const read = data.read;
    const tags = data.tags || [];
    const feedTitle = data.title;
    const newIcon = <span className="new-icon">NEW</span>;
    const className = cls(
      'post-item',
      tags.map(tag => `${tag}-tagged`).join(' '),
      this.props.highlight ? 'highlight-item' : null,
      read ? null : 'unread'
    );

    return (
      <li onClick={() => this.props.onOpen(data)} className={className}>
        <div className="feed-info">
          <Avatar ref="avatar" text={feedTitle} />
          <div className="title">{feedTitle}</div>
        </div>
        <div className="title">{post.title}</div>
        <Actions
          showViewCarousel
          post={data}
          onOpenInCarousel={this.props.onOpenInCarousel}
          onTagsEdit={this.onTagsEdit}
        />
        {read ? null : newIcon}
        <Date value={post.date} />
      </li>
    );
  }
};
