'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Avatar = require('./text-avatar.jsx');
const Date = require('./date.jsx');
const Button = require('./icon-button.jsx');
const Description = require('./post-description.jsx');
const Scrolled = require('./scrolled.jsx');

module.exports = class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { scrolled: false };

    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
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
            <Button
              icon="view-list"
              title="List view"
              onClick={() => this.props.onClose(data)}
            />
            <Button icon="open-in-new" href={post.link} target="_blank" title="Open in new window"/>
          </div>
          <Date value={post.date}/>
        </div>
        <Scrolled className="content">
          <Description post={data}/>
        </Scrolled>
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
