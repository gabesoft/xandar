'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Button = require('./icon-button.jsx');
const $ = window.$;

const Store = require('../store').Store;

module.exports = class CollapsiblePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: false };
    this.onResize = this.onResize.bind(this);
    this.onToggleCollapse = this.onToggleCollapse.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.store = new Store({ prefix: this.props.id });
  }

  resize(width, pageX, pageY) {
    const el = ReactDOM.findDOMNode(this);

    $.style(el, { width: `${width}px` });

    this.store.set('width', width);
    this.store.set('collapsed', false);

    this.setState({ collapsed: false, pageX, pageY, width });
  }

  onResize(event) {
    if (this.state.drag) {
      const el = ReactDOM.findDOMNode(this);
      const dist = event.pageX - this.state.pageX;
      const width = el.offsetWidth + ((this.props.direction || 1) * dist);
      this.resize(width, event.pageX, event.pageY);
    }
  }

  onMouseDown(event) {
    this.setState({ drag: true, pageX: event.pageX, pageY: event.pageY });
    document.addEventListener('mousemove', this.onResize);
    document.body.classList.add('noselect');
  }

  onMouseUp(event) {
    this.setState({ drag: false, pageX: event.pageX, pageY: event.pageY });
    document.removeEventListener('mousemove', this.onResize);
    document.body.classList.remove('noselect');
  }

  onToggleCollapse() {
    this.store.set('collapsed', !this.state.collapsed);
    this.store.remove('width');
    this.setState({ collapsed: !this.state.collapsed });
  }

  componentWillMount() {
    this.setState({
      collapsed: this.store.get('collapsed')
    });
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp);
    const width = this.store.get('width');
    if (typeof width !== 'undefined' && !this.state.collapsed) {
      this.resize(width);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onResize);
  }

  render() {
    const unpinTitle = 'Double click to unpin. Drag to resize.';
    const pinTitle = 'Double click to pin. Drag to resize.';
    const className = [
      this.props.className,
      'collapsible-panel',
      this.state.collapsed ? 'collapsed' : ''
    ].join(' ');

    return (
      <div className={className}>
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
