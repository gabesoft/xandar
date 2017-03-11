'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Actions = require('./feed-item-actions.jsx');
const Counts = require('./post-counts.jsx');
const Avatar = require('./text-avatar.jsx');
const feedActions = require('../flux/feed-actions');
const postActions = require('../flux/post-actions');
const searchActions = require('../flux/search-actions');
const buildQuery = require('../query-builder').build;
const searchStore = require('../flux/search-store');
const cls = require('../util').cls;
const actions = require('../flux/feed-actions');


module.exports = class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.onSubscribe = this.onSubscribe.bind(this);
    this.onUnsubscribe = this.onUnsubscribe.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  onEdit() {
    const el = ReactDOM.findDOMNode(this.refs.avatar);
    actions.showEditFeedPopup({
      feed: this.props.feed,
      rect: el.getBoundingClientRect()
    });
  }

  onSubscribe() {
    feedActions.subscribe(this.props.feed);
  }

  onUnsubscribe() {
    feedActions.unsubscribe(this.props.feed);
  }

  onDelete() {
    const el = ReactDOM.findDOMNode(this.refs.avatar);
    feedActions.showDeleteFeedPopup({
      feed: this.props.feed,
      rect: el.getBoundingClientRect()
    });
  }

  onClick() {
    if (!this.props.feed.subscription) {
      return;
    }

    const feed = this.props.feed;
    const subscription = feed.subscription;
    const data = Object.assign({}, { title: feed.title }, subscription);
    const titleId = searchStore.getFeedTitleId(data);
    const query = buildQuery(`@${titleId}`);

    query.title = data.title;

    searchActions.selectPostQuery({ query });
    searchActions.savePostQuery({ query });
    postActions.loadPosts(query);
  }

  componentDidMount() {
    if (this.props.highlight) {
      this.props.onScrollIntoView(ReactDOM.findDOMNode(this));
    }
  }

  componentDidUpdate() {
    if (this.props.highlight) {
      this.props.onScrollIntoView(ReactDOM.findDOMNode(this));
    }
  }

  render() {
    const feed = this.props.feed;
    const title = (feed.subscription || {}).title || feed.title;
    const subscribed = Boolean(feed.subscription);
    const className = cls('feed-item',
      this.props.className,
      this.props.highlight ? 'highlight-item' : null
    );

    return (
      <li className={className} onClick={this.onClick}>
        <Avatar text={title} ref="avatar" className={subscribed ? '' : 'invisible'} />
        <div className="title">{title.toLowerCase()}</div>
        <Counts feed={feed} />
        <Actions
          feed={feed}
          onEdit={this.onEdit}
          onSubscribe={this.onSubscribe}
          onUnsubscribe={this.onUnsubscribe}
          onMarkAsRead={() => this.props.onMarkAsRead(feed)}
          onDelete={this.onDelete}
          showDelete={this.props.showDelete}
        />
      </li>
    );
  }
};
