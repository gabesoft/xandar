'use strict';

const React = require('react');
const Actions = require('./feed-actions.jsx');
const Counts = require('./post-counts.jsx');


module.exports = class Feed extends React.Component {
  render() {
    const feed = this.props.feed;
    const title = (feed.subscription || {}).title || feed.title;
    const subscribed = Boolean(feed.subscription);
    const avatarClass = `avatar ${subscribed ? '' : 'invisible'}`;
    const className = `feed-item ${this.props.className || ''}`;

    return (
      <li className={className}>
        <div className={avatarClass}>
          <span>AP</span>
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
