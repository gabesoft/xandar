'use strict';

const React = require('react');
const Actions = require('./feed-item-actions.jsx');
const getInitials = require('../util').getInitials;
const getColor = require('../util').getColor;
const cls = require('../util').cls;
const Counts = require('./post-counts.jsx');


module.exports = class Feed extends React.Component {
  render() {
    const feed = this.props.feed;
    const title = (feed.subscription || {}).title || feed.title;
    const subscribed = Boolean(feed.subscription);
    const className = `feed-item ${this.props.className || ''}`;
    const color = getColor(title);
    const avatarClass = cls('avatar', subscribed ? '' : 'invisible', `${color}-fg`);

    return (
      <li className={className}>
        <div className={avatarClass}>
          <span>{getInitials(title)}</span>
        </div>
        <div className="title">
          {title.toLowerCase()}
        </div>
        <Counts feed={feed}/>
        <Actions feed={feed}/>
      </li>
    );
  }
};
