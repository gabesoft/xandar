'use strict';

const React = require('react');
const Button = require('./icon-button.jsx');
const cls = require('../util').cls;

module.exports = class FeedGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  toggleGroupOpen(open) {
    this.props.onToggleGroupOpen(this.props.group, open);
  }

  render() {
    const group = this.props.group;
    const open = !this.props.closed;
    const expand = (
      <Button
        icon="chevron-right"
        scale="medium"
        onClick={() => this.toggleGroupOpen(true)}
      />
    );
    const collapse = (
      <Button
        icon="chevron-down"
        scale="medium"
        onClick={() => this.toggleGroupOpen(false)}
      />
    );
    const className = cls('feed-group', open ? 'open' : 'closed');

    return (
      <li className={className}>
        <div className="actions">
          {open ? collapse : expand}
        </div>
        <div className="title">{group.key}</div>
        <div className="item-count">{this.props.count}</div>
      </li>
    );
  }
};
