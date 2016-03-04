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

module.exports = class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { scrolled: false, scrollValue: 0 };

    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onTagsEdit = this.onTagsEdit.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  scrollElement(parent, selector) {
    if (parent) {
      const el = parent.querySelector(selector);
      if (el) {
        el.scrollTop = 0;
      }
    }
  }

  scrollToTop() {
    const el = ReactDOM.findDOMNode(this);
    this.scrollElement(el, '.content');
    this.scrollElement(el, '.post-description');
  }

  moveLeft() {
    this.props.onMoveLeft();
    this.scrollToTop();
  }

  moveRight() {
    this.props.onMoveRight();
    this.scrollToTop();
  }

  onScroll(event, value) {
    this.setState({ scrollValue: value });
  }

  onTagsEdit() {
    const el = ReactDOM.findDOMNode(this.refs.avatar);
    const rect = el.getBoundingClientRect();
    actions.showEditPostPopup({
      rect: { top: rect.top, left: rect.left },
      post: this.props.post
    });
  }

  onKeyDown(event) {
    if (!this.altOn && event.code === 'ArrowLeft') {
      this.moveLeft();
    } else if (!this.altOn && event.code === 'ArrowRight') {
      this.moveRight();
    } else if (event.code === 'AltLeft' || event.code === 'AltRight') {
      this.altOn = true;
    }
  }

  onKeyUp(event) {
    if (event.code === 'AltLeft' || event.code === 'AltRight') {
      this.altOn = false;
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  componentWillReceiveProps() {
    this.setState({ scrollValue: 0 });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
  }

  render() {
    const data = this.props.post;
    const post = data._source.post;
    const feedTitle = data._source.title;

    return (
      <div className="carousel">
        <progress className="read-progress" max="100" value={this.state.scrollValue}/>
        <div className="header" onClick={() => this.props.onClose(data)}>
          <div className="feed-info">
            <Avatar text={feedTitle} ref="avatar"/>
            <div className="title">{feedTitle}</div>
          </div>
          <div className="title">{post.title}</div>
          <Actions
            showViewList
            post={data}
            onTagsEdit={this.onTagsEdit}
            onViewListClick={() => this.props.onClose(data)}
          />
          <Date value={post.date}/>
        </div>
        <Scrolled className="content" onChildScroll={this.onScroll}>
          <Description post={data}/>
        </Scrolled>
        <div className="sidepanel right">
          <Button
            onClick={this.moveRight}
            icon="chevron-right"
            size="xlarge"
            disabled={this.props.index === store.getPostCount() - 1}
          />
        </div>
        <div className="sidepanel left">
          <Button
            onClick={this.moveLeft}
            icon="chevron-left"
            size="xlarge"
            disabled={this.props.index === 0}
          />
        </div>
      </div>
    );
  }
};
