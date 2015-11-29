const React = require('react');
const Transitions = require('react-addons-css-transition-group');
const FeedActions = require('./feed-actions.jsx');
const moment = require('moment');
const api = require('../app/api');

module.exports = React.createClass({
  getInitialState() {
    return { open: false, className: 'feed-item' };
  },

  onHeaderClick() {
    api.feedPosts(this.props.feed.id, 5).then(data => {
      const state = {
        open: !this.state.open,
        className: this.state.open ? 'feed-item' : 'feed-item active',
        posts: data
      };
      this.setState(state);
    });
  },

  onSubscribe() {
    this.props.onSubscribe(this.props.feed);
    return false;
  },

  onUnsubscribe() {
    this.props.onUnsubscribe(this.props.feed);
    return false;
  },

  onDelete() {
    this.props.onDelete(this.props.feed);
    return false;
  },

  renderPostSummary(post) {
    if (post.summary && post.summary !== 'null') {
      return post.summary;
    } else if (post.description && post.description !== 'null') {
      return post.description.substring(0, 300);
    }

    return '';
  },

  renderPost(post) {
    return (
      <div className="post">
        <a
          className="post-title truncate"
          href={post.link}
          target="_blank"
          title={this.renderPostSummary(post)}>
          {post.title}
        </a>
        <span className="post-date right">{moment(post.date).format('MM/DD/YYYY')}</span>
      </div>
    );
  },

  renderDetails() {
    const feed = this.props.feed;
    const posts = this.state.posts.map(post => {
      return (
        <li className="collection-item" key={post.id}>{this.renderPost(post)}</li>
      );
    });
    return (
      <div className="collapsible-body details">
        <div>
          <span className="right">
            {`last post ${moment(feed.lastPostDate).fromNow()}`}
          </span>
        </div>
        <span className="uri">
          <a target="_blank" href={feed.uri}>{feed.uri}</a>
        </span>
        <blockquote className="description">{feed.description}</blockquote>
        <h6>Latest posts</h6>
        <ul className="collection post-list">{posts}</ul>
      </div>
    );
  },

  render() {
    const feed = this.props.feed;
    const newBadge = () => {
      return (
        <span className="badge new">{feed.newCount}</span>
      );
    };

    return (
      <li className={this.state.className}>
        <div className="collapsible-header">
          <Transitions
            transitionName="fade-in"
            transitionAppear
            transitionAppearTimeout={300}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300} >
            <FeedActions
              feed={this.props.feed}
              className="actions"
              onDelete={this.onDelete}
              onSubscribe={this.onSubscribe}
              onUnsubscribe={this.onUnsubscribe} />
            <div className="title-info truncate" onClick = {this.onHeaderClick}>
              <span className="title">{feed.title}</span>
              <span className="author hide-on-small-only">
                {feed.author ? ' - ' + feed.author : ''}
              </span>
            </div>
            <div className="post-count">
              {feed.newCount ? newBadge() : ''}
              <span className="badge hide-on-small-only">{feed.postCount}</span>
            </div>
          </Transitions>
        </div>
        <Transitions
          transitionName="slide-in"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {this.state.open ? this.renderDetails() : ''}
        </Transitions>
      </li>
    );
  }
});
