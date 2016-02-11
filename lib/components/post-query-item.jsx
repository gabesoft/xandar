'use strict';

const React = require('react');
const Button = require('./icon-button.jsx');
const getInitials = require('../util').getInitials;
const getColor = require('../util').getColor;
const cls = require('../util').cls;

module.exports = class PostQueryItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      title: this.props.query.title,
      pin: this.props.query.pin
    };
  }

  render() {
    const query = this.props.query;
    const pin = <Button icon="pin" title="Pin query"/>;
    const unpin = <Button icon="pin-off" title="Unpin query"/>;
    const pinned = this.state.pin !== 0;
    const title = this.state.title || query.text;
    const color = getColor(title);
    const avatarClass = cls('avatar', `${color}-fg`);
    const titleClass = this.state.title ? 'title' : 'text';
    const className = cls('post-query-item', pinned ? 'pinned-item' : 'unpinned-item');

    return (
      <li className={className}>
        <div className={avatarClass}>
          <span>{getInitials(title)}</span>
        </div>
        <div className={titleClass} title={query.text}>
          {title}
        </div>
        <div className="actions">
          {pinned ? unpin : pin}
          <Button icon="pencil"/>
        </div>
      </li>
    );
  }
};
