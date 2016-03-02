'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Button = require('./icon-button.jsx');
const genId = require('../util').genId;
const $ = require('jquery');
const store = require('../store').store;

module.exports = class CollapsiblePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: false };
    this.onResize = this.onResize.bind(this);
    this.onToggleCollapse = this.onToggleCollapse.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  setValue(name, value) {
    store.set(`${this.props.id}-${name}`, value);
  }

  getValue(name) {
    return store.get(`${this.props.id}-${name}`);
  }

  removeValue(name) {
    store.remove(`${this.props.id}-${name}`);
  }

  resize(width, pageX, pageY) {
    const el = ReactDOM.findDOMNode(this.el);
    const $el = $(el);
    $el.width(width);

    this.setValue('width', width);
    this.setValue('collapsed', false);

    this.setState({ collapsed: false, pageX, pageY, width });
  }

  onResize(event) {
    if (this.state.drag && this.el) {
      const el = ReactDOM.findDOMNode(this.el);
      const $el = $(el);
      const dist = event.pageX - this.state.pageX;
      const width = $el.width() + ((this.props.direction || 1) * dist);
      this.resize(width, event.pageX, event.pageY);
    }
  }

  onMouseDown(event) {
    this.setState({ drag: true, pageX: event.pageX, pageY: event.pageY });
    $(document).on(`mousemove.${this.props.id}`, this.onResize);
    $('body').addClass('noselect');
  }

  onMouseUp(event) {
    this.setState({ drag: false, pageX: event.pageX, pageY: event.pageY });
    $(document).off(`mousemove.${this.props.id}`);
    $('body').removeClass('noselect');
  }

  onToggleCollapse() {
    this.setValue('collapsed', !this.state.collapsed);
    this.removeValue('width');
    this.setState({ collapsed: !this.state.collapsed });
  }

  componentWillMount() {
    this.setState({
      collapsed: this.getValue('collapsed') === 'true'
    });
  }

  componentDidMount() {
    $(document).on(`mouseup.${this.props.id}`, this.onMouseUp);

    const width = this.getValue('width');
    if (typeof width !== 'undefined' && !this.state.collapsed) {
      this.resize(width);
    }
  }

  componentWillUnmount() {
    $(document)
      .off('mouseup.${this.props.id}')
      .off(`mousemove.${this.props.id}`);
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
