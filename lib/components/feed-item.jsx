'use strict';

const React = require('react');
const Actions = require('./feed-item-actions.jsx');
const Counts = require('./post-counts.jsx');
const Avatar = require('./text-avatar.jsx');


module.exports = class Feed extends React.Component {
  render() {
    const feed = this.props.feed;
    const title = (feed.subscription || {}).title || feed.title;
    const subscribed = Boolean(feed.subscription);
    const className = `feed-item ${this.props.className || ''}`;

    return (
      <li className={className}>
        <Avatar text={title} className={subscribed ? '' : 'invisible'}/>
        <div className="title">
          {title.toLowerCase()}
        </div>
        <Counts feed={feed}/>
        <Actions
          feed={feed}
          onEdit={this.onEdit}
          onSubscribe={this.onSubscribe}
          onUnsubscribe={this.onUnsubscribe}
          onMarkAsRead={() => this.props.onMarkAsRead(feed)}
        />
      </li>
    );
  }
};
