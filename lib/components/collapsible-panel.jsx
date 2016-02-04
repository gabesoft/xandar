'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const genId = require('../util').genId;
const $ = require('jquery');

module.exports = class CollapsiblePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: false };
    this.onResize = this.onResize.bind(this);
    this.onToggleCollapse = this.onToggleCollapse.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.id = `panel-${genId()}`;
  }

  onResize(event) {
    if (this.state.drag && this.el) {
      const el = ReactDOM.findDOMNode(this.el);
      const $el = $(el);
      const dist = event.pageX - this.state.pageX;
      const width = $el.width() + ((this.props.direction || 1) * dist);
      $el.width(width);

      this.setState({
        collapsed: false,
        pageX: event.pageX,
        pageY: event.pageY,
        width
      });
    }
  }

  onMouseDown(event) {
    this.setState({ drag: true, pageX: event.pageX, pageY: event.pageY });
    $(document).on(`mousemove.${this.id}`, this.onResize);
  }

  onMouseUp(event) {
    this.setState({ drag: false, pageX: event.pageX, pageY: event.pageY });
    $(document).off(`mousemove.${this.id}`);
  }

  onToggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  componentDidMount() {
    $(document).on(`mouseup.${this.id}`, this.onMouseUp);
  }

  componentWillUnmount() {
    $(document)
      .off('mouseup.${this.id}')
      .off(`mousemove.${this.id}`);
  }

  render() {
    const className = [
      this.props.className,
      'collapsible-panel',
      this.state.collapsed ? 'collapsed' : ''
    ].join(' ');

    return (
      <div ref={el => this.el = el} className={className}>
        <i
          onMouseDown={this.onMouseDown}
          onDoubleClick={this.onToggleCollapse}
          className="mdi mdi-drag-vertical drag-icon">
        </i>
        <div className="panel-content">
          {this.props.children}
        </div>
      </div>
    );
  }
};
