'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const cls = require('../util').cls;
const Avatar = require('./text-avatar.jsx');
const Date = require('./date.jsx');
const Button = require('./icon-button.jsx');
const Description = require('./post-description.jsx');

module.exports = class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { scrolled: false };

    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.onContentScroll = this.onContentScroll.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onContentScroll(event) {
    this.setState({ scrolled: event.target.scrollTop > 0 });
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

  onKeyDown(event) {
    if (event.which === 37) {
      this.moveLeft();
    } else if (event.which === 39) {
      this.moveRight();
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  render() {
    const data = this.props.post;
    const post = data._source.post;
    const feedTitle = data._source.title;
    const contentClass = cls('content', this.state.scrolled ? 'scrolled' : null);

    // TODO: set disabled sidepanels at edges

    return (
      <div className="carousel">
        <div className="header" onClick={() => this.props.onClose(data)}>
          <div className="feed-info">
            <Avatar text={feedTitle}/>
            <div className="title">{feedTitle}</div>
          </div>
          <div className="title">{post.title}</div>
          <div className="actions">
            <Button icon="close" color="red" onClick={() => this.props.onClose(data)}/>
            <Button icon="open-in-new" href={post.link} target="_blank" title="Open in new window"/>
          </div>
          <Date value={post.date}/>
        </div>
        <div className={contentClass} onScroll={this.onContentScroll}>
          <Description post={data}/>
        </div>
        <div className="sidepanel right">
          <Button onClick={this.moveRight} icon="chevron-right" size="xlarge"/>
        </div>
        <div className="sidepanel left">
          <Button onClick={this.moveLeft} icon="chevron-left" size="xlarge"/>
        </div>
      </div>
    );
  }
};
