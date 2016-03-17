'use strict';

const translate = { start: 1, center: -29, end: -59 };

const React = require('react');
const ReactDOM = require('react-dom');
const Item = require('./carousel-item.jsx');
const store = require('../flux/post-store');
const actions = require('../flux/post-actions');
const Hammer = require('hammerjs');
const isSmallScreen = require('../util').isSmallScreen;
const transitionEnd = require('../util').transitionEnd;

module.exports = class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { scrollValue: 0 };

    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.navigateLeft = this.navigateLeft.bind(this);
    this.navigateRight = this.navigateRight.bind(this);
    this.onPanMove = this.onPanMove.bind(this);
    this.onPanEnd = this.onPanEnd.bind(this);
  }

  isFirst() {
    return this.props.index === 0;
  }

  isLast() {
    return this.props.index === store.getPostCount() - 1;
  }

  onPanMove(event) {
    const speed = (this.isFirst() || this.isLast()) ? 0.4 : 0.8;
    const el = ReactDOM.findDOMNode(this);
    const width = el.getBoundingClientRect().width;
    const delta = (event.deltaX / width) * 100 * speed;
    this.move(translate.center + delta);
  }

  onPanEnd() {
    const threshold = 8;
    if ((this.moveAmount - translate.center) > threshold && !this.isFirst()) {
      this.moveLeft();
    } else if ((translate.center - this.moveAmount) > threshold && !this.isLast()) {
      this.moveRight();
    } else {
      this.move(translate.center, true);
    }
  }

  navigateLeft() {
    this.navigate('onMoveLeft');
  }

  navigateRight() {
    this.navigate('onMoveRight');
  }

  navigate(moveFn) {
    this.move(translate.center);
    this.props[moveFn]();
  }

  move(amount, animate, cb) {
    if (this.moving) {
      return;
    }

    cb = cb || (() => {});

    this.moving = true;
    this.moveAmount = amount;

    const el = ReactDOM.findDOMNode(this);
    const done = () => {
      el.removeEventListener(transitionEnd, done);
      el.classList.remove('animate');
      this.moving = false;
      cb();
    };

    if (animate) {
      el.classList.add('animate');
    }

    el._.style({ transform: `translateX(${amount}%)` });

    if (animate) {
      el.addEventListener(transitionEnd, done);
    } else {
      this.moving = false;
      cb();
    }
  }

  moveLeft() {
    if (this.isFirst()) {
      actions.carouselAtTop();
    } else {
      this.move(translate.start, true, this.navigateLeft);
    }
  }

  moveRight() {
    if (this.isLast()) {
      actions.carouselAtEnd();
    } else {
      this.move(translate.end, true, this.navigateRight);
    }
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

    this.move(translate.center);

    if (isSmallScreen()) {
      const element = ReactDOM.findDOMNode(this);
      this.hammer = new Hammer(element, {
        recognizers: [[Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL }]]
      });

      this.hammer.on('panstart panright panleft', this.onPanMove);
      this.hammer.on('panend', this.onPanEnd);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    if (this.hammer) {
      this.hammer.off('panstart panright panleft panend');
    }
  }

  makeItem(post, active) {
    return (
      <Item
        post={post}
        className={active ? 'active' : null}
        onClose={this.props.onClose}
        onMoveRight={this.moveRight}
        onMoveLeft={this.moveLeft}
        index={this.props.index}
      />
    );
  }

  render() {
    return (
      <ul className="carousel">
        {this.makeItem(store.getPostByIndex(this.props.index - 1))}
        {this.makeItem(store.getPostByIndex(this.props.index), true)}
        {this.makeItem(store.getPostByIndex(this.props.index + 1))}
      </ul>
    );
  }
};
