'use strict';

const React = require('react');
const Button = require('./icon-button.jsx');

module.exports = class FeedGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { closed: this.props.closed };
  }

  toggleGroupOpen(open) {
    this.setState({ closed: !open });
  }

  render() {
    const group = this.props.group;
    const open = !this.state.closed;
    const openGroup = (
      <Button
        icon="chevron-right"
        onClick={() => this.toggleGroupOpen(true)}
      />
    );
    const closeGroup = (
      <Button
        icon="chevron-down"
        onClick={() => this.toggleGroupOpen(false)}
      />
    );
    const className = `feed-group ${open ? 'open' : 'closed'}`;

    return (
      <li className={className}>
        <div className="actions">
          {open ? closeGroup : openGroup}
        </div>
        <div className="title">{group.key}</div>
      </li>
    );
  }
};
