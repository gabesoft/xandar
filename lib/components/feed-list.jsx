const React = require('react');
const Feed = require('./feed.jsx');
const debounce = require('../util').debounce;
const ct = require('../constants');
const fc = ct.feeds;
const dispatcher = require('../flux/dispatcher');
const store = require('../flux/feed-store');
const actions = require('../flux/feed-actions');
const timeout = require('../util').timeout;
const VelTrans = require('velocity-react/velocity-transition-group');
const Loader = require('./loader.jsx');
const Modal = require('./feed-add-modal.jsx');
const Count = require('./count-display.jsx');

module.exports = class FeedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feeds: store.getFeeds(),
      filter: '',
      isModalOpen: false,
      loading: true
    };
    this.onStoreChange = this.onStoreChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onFeedAddAttempt = this.onFeedAddAttempt.bind(this);
    this.onFeedAddAccept = this.onFeedAddAccept.bind(this);
    this.onFeedAddCancel = this.onFeedAddCancel.bind(this);
  }

  onStoreChange(data) {
    if (data.type === 'feeds') {
      this.setState({ feeds: store.getFeeds(), loading: false });
    }
  }

  onSearch(query) {
    this.setState({ filter: query });
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
      const title = ((feed.subscription || {}).title || feed.title || '').toLowerCase();
      return title.match(filter) || author.match(filter);
    });
  }

  componentDidMount() {
    store.addListener(fc.STORE_CHANGE, this.onStoreChange);

    const onSearch = debounce(this.onSearch, 150);
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case fc.FIND_FEED_DONE:
          this.setState({ loading: false, addedId: action.data.feed.id });
          timeout(fc.ADDED_ACTIVE_DELAY).then(() => this.setState({ addedId: null }));
          break;
        case ct.nav.SEARCH:
          onSearch(action.query);
          break;
        default:
          break;
      }
    });

    actions.loadFeeds();
  }

  componentWillUnmount() {
    store.removeListener(fc.STORE_CHANGE, this.onStoreChange);
    dispatcher.unregister(this.tokenId);
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
    const filteredCount = this.filteredFeeds().length;
    const feedCount = this.state.feeds.length;
    const filtered = filteredCount !== feedCount ? `${filteredCount}/` : '';

    return (
      <div className="feed-list-header card blue-grey darken-1">
        <div className="card-content white-text right-align">
          {this.state.loading ? this.renderAddLoader() : this.renderAddButton()}
          <p>
            <Count value={store.subscriptionCount()} label="Subscriptions"/>
            <Count value={`${filtered}${feedCount}`} label="Feeds"/>
          </p>
        </div>
        <Modal
          isOpen={this.state.isModalOpen}
          onAcceptClick={this.onFeedAddAccept}
          onCancelClick={this.onFeedAddCancel}
        />
      </div>
    );
  }

  renderItems() {
    const feeds = this.filteredFeeds();
    const items = feeds.map(feed => {
      return (
        <VelTrans
          key={feed.id}
          enter={{ animation: 'fadeIn' }}
          leave={{ animation: 'fadeOut' }}
          runOnMount>
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
