'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Button = require('./icon-button.jsx');
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
    $('body').addClass('noselect');
  }

  onMouseUp(event) {
    this.setState({ drag: false, pageX: event.pageX, pageY: event.pageY });
    $(document).off(`mousemove.${this.id}`);
    $('body').removeClass('noselect');
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
    const unpinTitle = 'Double click to unpin';
    const pinTitle = 'Double click to pin';
    const className = [
      this.props.className,
      'collapsible-panel',
      this.state.collapsed ? 'collapsed' : ''
    ].join(' ');

    return (
      <div ref={el => this.el = el} className={className}>
        <Button
          onMouseDown={this.onMouseDown}
          onDoubleClick={this.onToggleCollapse}
          icon="drag-vertical"
          size="medium"
          color={this.state.collapsed ? 'red' : 'blue'}
          title={this.state.collapsed ? pinTitle : unpinTitle}
          className="drag-icon"
        />
        <div className="panel-content">
          {this.props.children}
        </div>
      </div>
    );
  }
};
