'use strict';

const React = require('react');
const cls = require('../util').cls;

module.exports = class Scrolled extends React.Component {
  constructor(props) {
    super(props);
    this.state = { topScrolled: false };
    this.onScroll = this.onScroll.bind(this);
  }


  onScroll(event) {
    this.setState({ topScrolled: event.target.scrollTop > 0 });
    if (this.props.onScroll) {
      this.props.onScroll(event);
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
