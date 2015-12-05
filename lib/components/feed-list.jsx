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

// TODO: move to a util class
function debounce(fn, delay) {
  let timer = null;
  return function debounced() {
    const context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

module.exports = class FeedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feeds: store.getFeeds(),
      isModalOpen: false,
      filter: ''
    };
    this.onStoreChange = this.onStoreChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onFeedAddAttempt = this.onFeedAddAttempt.bind(this);
    this.onFeedAddAccept = this.onFeedAddAccept.bind(this);
    this.onFeedAddCancel = this.onFeedAddCancel.bind(this);
  }

  onStoreChange() {
    this.setState({ feeds: store.getFeeds() });
  }

  onSearch(event) {
    this.setState({ filter: event.target.value });
  }

  onFeedAddAttempt() {
    this.setState({ isModalOpen: true });
  }

  onFeedAddAccept(uri) {
    if (uri) {
      actions.findFeed(uri);
      this.setState({ isModalOpen: false, loading: true });
    }
  }

  onFeedAddCancel() {
    this.setState({ isModalOpen: false });
  }

  filteredFeeds() {
    const filter = (this.state.filter || '').toLowerCase();
    return this.state.feeds.filter(feed => {
      const author = (feed.author || '').toLowerCase();
      const title = (feed.title || '').toLowerCase();
      return title.match(filter) || author.match(filter);
    });
  }

  componentDidMount() {
    store.addListener(fc.STORE_FEEDS_CHANGE, this.onStoreChange);
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case fc.FIND_FEED_DONE:
          this.setState({ loading: false, addedId: action.data.feed.id });
          setTimeout(() => {
            this.setState({ addedId: null });
          }, fc.FEED_ADDED_ACTIVE_DELAY);
          break;
        default:
          break;
      }
    });

    actions.loadFeeds();
  }

  componentWillUnmount() {
    store.removeListener(fc.STORE_FEEDS_CHANGE, this.onStoreChange);
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
    const feedCounts = `${this.filteredFeeds().length} Feeds`;

    return (
      <div className="card blue-grey darken-1">
        <div className="card-content white-text right-align">
          <div className="input-field feed-search">
            <input id="feed-search-input" type="text" onChange={debounce(this.onSearch, 150)}/>
            <label htmlFor="feed-search-input">Feed Search</label>
          </div>
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
    const feeds = this.filteredFeeds();
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

