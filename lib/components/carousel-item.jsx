'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Avatar = require('./text-avatar.jsx');
const Date = require('./date.jsx');
const Button = require('./icon-button.jsx');
const Actions = require('./post-item-actions.jsx');
const Description = require('./post-description.jsx');
const Scrolled = require('./scrolled.jsx');
const store = require('../flux/post-store');
const actions = require('../flux/post-actions');
const cls = require('../util').cls;
const wait = require('../util').wait;

module.exports = class CarouselItem extends React.Component {
  constructor(props) {
    super(props);
    this.onTagsEdit = this.onTagsEdit.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  onTagsEdit() {
    const el = ReactDOM.findDOMNode(this.refs.avatar);
    const rect = el.getBoundingClientRect();
    actions.showEditPostPopup({
      rect: { top: rect.top, left: rect.left },
      post: this.props.post
    });
  }

  onScroll(event, value) {
    ReactDOM.findDOMNode(this.refs.progress).value = value;
  }

  componentDidUpdate() {
    const parent = ReactDOM.findDOMNode(this);
    const progress = ReactDOM.findDOMNode(this.refs.progress);

    progress.classList.add('invisible');
    progress.value = 0;

    this.scrollElement(parent, '.post-description');

    wait(500).then(() => progress.classList.remove('invisible'));
  }

  scrollElement(parent, selector) {
    if (parent) {
      const el = parent.querySelector(selector);
      if (el) {
        el.scrollTop = 0;
      }
    }
  }

  render() {
    const hasPost = Boolean(this.props.post);
    const className = cls('carousel-item', this.props.className, hasPost ? null : 'invisible');
    const data = this.props.post || {};
    const post = (data._source || {}).post || {};
    const feedTitle = (data._source || {}).title;
    const postActions = (
      <Actions
        showViewList
        post={data}
        onTagsEdit={this.onTagsEdit}
        onViewListClick={() => this.props.onClose(data)}
      />
    );
    const postDescription = (
      <Scrolled className="content" onChildScroll={this.onScroll}>
        <Description ref="description" post={data} />
      </Scrolled>
    );

    return (
      <li className={className}>
        <progress className="read-progress" ref="progress" max="100" value="0" />
        <div className="header" onClick={() => this.props.onClose(data)}>
          <div className="feed-info">
            <Avatar text={feedTitle} ref="avatar" />
            <div className="title">{feedTitle}</div>
          </div>
          <div className="title">{post.title}</div>
          {hasPost ? postActions : null}
          <Date value={post.date} />
        </div>
        {hasPost ? postDescription : null}
        <div className="sidepanel right">
          <Button
            onClick={this.props.onMoveRight}
            icon="chevron-right"
            size="xlarge"
            disabled={this.props.index === store.getPostCount() - 1}
          />
        </div>
        <div className="sidepanel left">
          <Button
            onClick={this.props.onMoveLeft}
            icon="chevron-left"
            size="xlarge"
            disabled={this.props.index === 0}
          />
        </div>
      </li>
    );
  }
};
