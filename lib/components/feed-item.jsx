'use strict';

const React = require('react');
const Actions = require('./feed-item-actions.jsx');
const Counts = require('./post-counts.jsx');
const Avatar = require('./text-avatar.jsx');
const feedActions = require('../flux/feed-actions');
const postActions = require('../flux/post-actions');
const searchActions = require('../flux/search-actions');
const parse = require('../post-query').parse;
const searchStore = require('../flux/search-store');


module.exports = class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.onSubscribe = this.onSubscribe.bind(this);
    this.onUnsubscribe = this.onUnsubscribe.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onSubscribe() {
    feedActions.subscribe(this.props.feed);
  }

  onUnsubscribe() {
    feedActions.unsubscribe(this.props.feed);
  }

  onDelete() {
    feedActions.deleteFeed(this.props.feed);
  }

  onClick() {
    if (!this.props.feed.subscription) {
      return;
    }

    const feed = this.props.feed;
    const subscription = feed.subscription;
    const data = Object.assign({}, { title: feed.title }, subscription);
    const titleId = searchStore.getFeedTitleId(data);
    const query = parse(`@${titleId}`);

    query.title = data.title;
    searchActions.selectPostQuery({ data: query });
    searchActions.savePostQuery({ query });
    postActions.loadPosts(query);
  }

  render() {
    const feed = this.props.feed;
    const title = (feed.subscription || {}).title || feed.title;
    const subscribed = Boolean(feed.subscription);
    const className = `feed-item ${this.props.className || ''}`;

    return (
      <li className={className} onClick={this.onClick}>
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
