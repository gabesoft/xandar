const React = require('react');
const Feed = require('./feed.jsx');
const trans = require('trans');
const toast = require('../mixins/toast');
const fc = require('../feed-constants');
const dispatcher = require('../flux/dispatcher');
const store = require('../flux/feed-store');
const actions = require('../flux/feed-actions');
const VelTrans = require('velocity-react/velocity-transition-group');
const Loader = require('./loader.jsx');
const Modal = require('./feed-add-modal.jsx');

/* TODO move to a better place */
dispatcher.register(action => {
  switch (action.type) {
    case fc.SUBSCRIBE_DONE:
      toast.success(`Subscribed to feed ${action.feed.title}`);
      break;
    case fc.SUBSCRIBE_FAIL:
      toast.error(`Failed to subscribe to feed ${action.feed.title}`);
      break;
    case fc.UNSUBSCRIBE_DONE:
      toast.success(`Unsubscribed from feed ${action.feed.title}`);
      break;
    case fc.UNSUBSCRIBE_FAIL:
      toast.error(`Failed to unsubscribe from feed ${action.feed.title}`);
      break;
    case fc.DELETE_DONE:
      toast.success(`Deleted feed ${action.feed.title}`);
      break;
    case fc.DELETE_FAIL:
      toast.error(`Failed to delete feed ${action.feed.title}`);
      break;
    case fc.FIND_FEED_DONE:
      const feed = action.data.feed;
      if (feed.isNew) {
        toast.success(`Added feed ${feed.title}`);
      } else {
        toast.warn(`Feed ${feed.title} already exists`);
      }
      break;
    case fc.FIND_FEED_FAIL:
      toast.error(`Failed to find a feed for ${action.uri}`);
      break;
    default:
      break;
  }
});

module.exports = class FeedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { feeds: store.getFeeds(), isModalOpen: false };
    this.onChange = this.onChange.bind(this);
    this.onFeedAddAttempt = this.onFeedAddAttempt.bind(this);
    this.onFeedAddAccept = this.onFeedAddAccept.bind(this);
    this.onFeedAddCancel = this.onFeedAddCancel.bind(this);
  }

  onChange() {
    this.state.feeds = store.getFeeds();
    this.setState(this.state);
  }

  onFeedAddAttempt() {
    this.state.isModalOpen = true;
    this.setState(this.state);
  }

  onFeedAddAccept(uri) {
    if (uri) {
      actions.findFeed(uri);
      this.state.isModalOpen = false;
      this.state.loading = true;
      this.setState(this.state);
    }
  }

  onFeedAddCancel() {
    this.state.isModalOpen = false;
    this.setState(this.state);
  }

  componentDidMount() {
    store.addListener(fc.STORE_FEEDS_CHANGE, this.onChange);
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case fc.FIND_FEED_DONE:
          this.state.addedId = action.data.feed.id;
          this.state.loading = false;
          this.setState(this.state);
          setTimeout(() => {
            this.state.addedId = null;
            this.setState(this.state);
          }, fc.FEED_ADDED_ACTIVE_DELAY);
          break;
        default:
          break;
      }
    });

    actions.loadFeeds();
  }

  componentWillUnmount() {
    store.removeListener(fc.STORE_FEEDS_CHANGE, this.onChange);
    dispatcher.unregister(this.tokenId);
  }

  subscriptionCount() {
    return trans(this.state.feeds).filter('subscription', Boolean).count();
  }

  renderAddButton() {
    return (
      <a
        title="Add new feed"
        className="btn-floating waves-effect waves-light add-feed-btn"
        onClick={this.onFeedAddAttempt}>
        <i className="material-icons">add</i>
      </a>
    );
  }

  renderAddLoader() {
    return (
      <Loader size="medium" className="add-feed-loader"/>
    );
  }

  renderHeader() {
    const subCounts = `${this.subscriptionCount()} Subscriptions`;
    const feedCounts = `${this.state.feeds.length} Feeds`;

    return (
      <div className="card blue-grey darken-1">
        <div className="card-content white-text right-align">
          {this.state.loading ? this.renderAddLoader() : this.renderAddButton()}
          <p>{subCounts + ' ' + feedCounts}</p>
        </div>
        <Modal
          isOpen={this.state.isModalOpen}
          onAcceptClick={this.onFeedAddAccept}
          onCancelClick={this.onFeedAddCancel}/>
      </div>
    );
  }

  renderItems() {
    const feeds = this.state.feeds;
    const items = feeds.map(feed => {
      return (
        <VelTrans key={feed.id} enter={{animation: 'fadeIn'}} leave={{animation: 'fadeOut'}} runOnMount>
          <Feed key={feed.id} feed={feed} added={this.state.addedId === feed.id}/>
        </VelTrans>
      );
    });

    return (
      <ul className="collapsible feed-list">
        {items}
      </ul>
    );
  }

  render() {
    return (
      <div>
        {this.renderHeader()}
        {this.renderItems()}
      </div>
    );
  }
};

