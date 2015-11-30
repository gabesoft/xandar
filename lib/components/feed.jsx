const React = require('react');
const FeedActions = require('./feed-actions.jsx');
const moment = require('moment');
const fc = require('../feed-constants');
const actions = require('../flux/feed-actions');
const store = require('../flux/feed-store');
const Loader = require('./loader.jsx');
const VelTrans = require('velocity-react/velocity-transition-group');

module.exports = class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, className: 'feed-item' };
    this.onChange = this.onChange.bind(this);
    this.onHeaderClick = this.onHeaderClick.bind(this);
  }

  componentDidMount() {
    store.addListener(fc.STORE_POSTS_CHANGE, this.onChange);
  }

  componentWillUnmount() {
    store.removeListener(fc.STORE_POSTS_CHANGE, this.onChange);
  }

  onChange(feedId) {
    if (feedId === this.props.feed.id) {
      this.state.posts = store.getPosts(this.props.feed.id);
      this.state.open = this.state.loading;
      this.state.loading = false;
      this.setState(this.state);
    }
  }

  onHeaderClick() {
    const posts = store.getPosts(this.props.feed.id);
    let loading = false;
    if (!this.state.open && posts.length === 0) {
      actions.loadPosts(this.props.feed);
      loading = true;
    }
    this.setState({
      loading: loading,
      open: !this.state.open && !loading,
      className: this.state.open ? 'feed-item' : 'feed-item active',
      posts: posts
    });
  }

  onSubscribe() {
    actions.subscribe(this.props.feed);
  }

  onUnsubscribe() {
    actions.unsubscribe(this.props.feed);
  }

  onDelete() {
    actions.deleteFeed(this.props.feed);
  }

  postSummary(post) {
    if (post.summary && post.summary !== 'null') {
      return post.summary;
    } else if (post.description && post.description !== 'null') {
      return post.description.substring(0, 300);
    }

    return '';
  }

  renderPost(post) {
    return (
      <div className="post">
        <a
          className="post-title truncate"
          href={post.link}
          target="_blank"
          title={this.postSummary(post)}>
          {post.title}
        </a>
        <span className="post-date right">
          {moment(post.date).format('MM/DD/YYYY')}
        </span>
      </div>
    );
  }

  renderDetails() {
    const feed = this.props.feed;
    const posts = (this.state.posts || []).map(post => {
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
  }

  renderNewCount() {
    return (
      <span className="badge new">
        {this.props.feed.newCount}
      </span>
    );
  }

  renderPostCount() {
    return (
      <span className="badge hide-on-small-only">
        {this.props.feed.postCount}
      </span>
    );
  }

  render() {
    const feed = this.props.feed;
    const loader = () => {
      return (this.state.loading ? <Loader size="small" className="details-loader"/> : undefined);
    };

    return (
      <li className={this.state.className}>
        <div className="collapsible-header">
          <FeedActions
            feed={this.props.feed}
            className="actions"
            onDelete={this.onDelete}
            onSubscribe={this.onSubscribe}
            onUnsubscribe={this.onUnsubscribe}/>
          {loader()}
          <div className="title-info truncate" onClick = {this.onHeaderClick}>
            <span className="title">{feed.title}</span>
            <span className="author hide-on-small-only">
              {feed.author ? ` - ${feed.author}` : ''}
            </span>
          </div>
          <div className="post-count">
            {feed.newCount ? this.renderNewCount() : ''}
            {this.renderPostCount()}
          </div>
        </div>
        <VelTrans enter={{animation: 'slideDown'}} leave={{animation: 'slideUp'}} runOnMount>
          {this.state.open ? this.renderDetails() : undefined}
        </VelTrans>
      </li>
    );
  }
};
