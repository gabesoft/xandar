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
    const actionsClass = `actions ${subscribed ? 'five' : 'four'}`;

    const edit = (<Button icon="pencil"/>);
    const plus = (<Button icon="plus-circle-outline" title="Subscribe to feed" color="green"/>);
    const minus = (<Button icon="minus-circle-outline" title="Unsubscribe from feed" color="red"/>);

    return (
      <div className={actionsClass}>
        {subscribed ? edit : null}
        {subscribed ? minus : plus}
        <Button icon="open-in-new" href={feed.link} target="_blank"/>
        <Button icon="ic_rss_feed_48px" href={feed.uri} target="_blank" color="orange"/>
        <Button icon="delete" color="red"/>
      </div>
    );
  }
};
