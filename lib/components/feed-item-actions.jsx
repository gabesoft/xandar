'use strict';

const React = require('react');
const Button = require('./icon-button.jsx');

module.exports = class FeedActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const feed = this.props.feed;

    const subscribed = Boolean(feed.subscription);
    const hasUnread = subscribed && feed.subscription.unreadCount > 0;

    const edit = (
      <Button
        icon="pencil"
        onClick={this.props.onEdit}
        title="Edit subscription"
      />
    );
    const plus = (
      <Button
        color="green"
        icon="plus-circle-outline"
        onClick={this.props.onSubscribe}
        title="Subscribe to feed"
      />
    );
    const minus = (
      <Button
        color="red"
        icon="minus-circle-outline"
        onClick={this.props.onUnsubscribe}
        title="Unsubscribe from feed"
      />
    );
    const markAsRead = (
      <Button
        icon="read"
        onClick={this.props.onMarkAsRead}
        title="Mark all posts as read"
      />
    );

    return (
      <div className="actions">
        {hasUnread ? markAsRead : null}
        {subscribed ? edit : null}
        {subscribed ? minus : plus}
        <Button icon="open-in-new" href={feed.link} target="_blank"/>
        <Button icon="ic_rss_feed_48px" href={feed.uri} target="_blank" color="orange"/>
        <Button icon="delete" color="red"/>
      </div>
    );
  }
};
