'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const cls = require('../util').cls;
const $ = require('jquery');
const genId = require('../util').genId;

module.exports = class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.id = genId();
  }

  componentDidMount() {
    $('html').on('click.popup', event => {
      const parent = ReactDOM.findDOMNode(this);
      const isSelf = $(parent).is(event.target);
      const isInside = $.contains(parent, event.target);

      if (parent && !isSelf && !isInside && this.props.active) {
        this.props.onClose();
      }
    });
  }

  componentWillUnmount() {
    $('html').off('click.popup');
  }

  render() {
    const style = {
      top: this.props.top + 30,
      left: this.props.left - 10
    };
    const className = cls(
      'popup',
      `popup-${this.id}`,
      this.props.className,
      this.props.active ? 'active' : null
    );

    return (
      <div className={className} onClick={this.onClick} style={style}>
        {this.props.children}
      </div>
    );
  }
};
