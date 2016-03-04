'use strict';

const React = require('react');
const cls = require('../util').cls;

module.exports = class Scrolled extends React.Component {
  constructor(props) {
    super(props);
    this.state = { topScrolled: false };
    this.onScroll = this.onScroll.bind(this);
  }

  updateScrolled(el) {
    this.setState({ topScrolled: el && el.scrollTop > 0 });
  }

  onScroll(event) {
    this.updateScrolled(event.target);
    if (this.props.onScroll) {
      const top = event.target.scrollTop;
      const sh = event.target.scrollHeight;
      const ch = event.target.clientHeight;
      const value = Math.round(100 * top / (sh - ch));
      this.props.onScroll(event, isNaN(value) ? 0 : value);
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.type && this.props.type !== newProps.type) {
      this.setState({ topScrolled: false });
    }
  }

  render() {
    const className = cls(
      this.props.className,
      (this.state.topScrolled && !this.props.disabled) ? 'top-scrolled' : null);

    return (
      <div className={className} onScroll={this.onScroll}>
        {this.props.children}
      </div>
    );
  }
};
