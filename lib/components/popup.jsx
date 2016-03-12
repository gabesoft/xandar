'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const cls = require('../util').cls;
const genId = require('../util').genId;
const $ = window.$;

module.exports = class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.id = genId();
    this.onHtmlClick = this.onHtmlClick.bind(this);
  }

  onHtmlClick(event) {
    const parent = ReactDOM.findDOMNode(this);
    const isSelf = parent.isSameNode(event.target);
    const isInside = parent.contains(event.target);
    if (parent && !isSelf && !isInside && this.props.active) {
      this.props.onClose();
    }
  }

  componentDidMount() {
    $('html').addEventListener('click', this.onHtmlClick);
  }

  componentWillUnmount() {
    $('html').removeEventListener('click', this.onHtmlClick);
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
