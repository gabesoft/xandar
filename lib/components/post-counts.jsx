'use strict';

const React = require('react');

module.exports = class PostCounts extends React.Component {
  render() {
    const feed = this.props.feed;
    const subscription = feed.subscription;

    const subscribed = Boolean(subscription);
    const hasNew = subscribed && subscription.unreadCount > 0;

    const newCount = hasNew ? (<span className="new">{subscription.unreadCount}</span>) : null;
    const allCount = (<span className="all">{feed.postCount}</span>);

    return (
      <div className="post-counts">
        {newCount}
        {allCount}
      </div>
    );
  }
};
