const React = require('react');
const api = require('../api/client');
const Feed = require('./feed.jsx');
const trans = require('trans');
const toast = require('../mixins/toast');
const fc = require('../feed-constants');
const dispatcher = require('../flux/dispatcher');
const store = require('../flux/feed-store');
const actions = require('../flux/feed-actions');
const VelTrans = require('velocity-react/velocity-transition-group');

dispatcher.register(action => {
  switch (action.type) {
    case fc.SUBSCRIBE_DONE:
      toast.success(`Subscribed to feed ${action.feed.title}`);
      break;
    case fc.SUBSCRIBE_FAIL:
      toast.success(`Failed to subscribe to feed ${action.feed.title}`);
      break;
    case fc.UNSUBSCRIBE_DONE:
      toast.success(`Unsubscribed from feed ${action.feed.title}`);
      break;
    case fc.UNSUBSCRIBE_FAIL:
      toast.success(`Failed to unsubscribe from feed ${action.feed.title}`);
      break;
    case fc.DELETE_DONE:
      toast.success(`Deleted feed ${action.feed.title}`);
      break;
    case fc.DELETE_FAIL:
      toast.success(`Failed to delete feed ${action.feed.title}`);
      break;
    default:
      break;
  }
});

module.exports = class FeedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { feeds: store.getFeeds() };
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    this.setState({ feeds: store.getFeeds() });
  }

  componentDidMount() {
    store.addListener(fc.STORE_FEEDS_CHANGE, this.onChange);
    actions.loadFeeds();
  }

  componentWillUnmount() {
    store.removeListener(fc.STORE_FEEDS_CHANGE, this.onChange);
  }

  subscriptionCount() {
    return trans(this.state.feeds).filter('subscription', Boolean).count();
  }

  renderHeader() {
    const subCounts = `${this.subscriptionCount()} Subscriptions`;
    const feedCounts = `${this.state.feeds.length} Feeds`;

    return (
      <div className="card blue-grey darken-1">
        <div className="card-content white-text right-align">
          <a
            title="Add new feed"
            className="btn-floating waves-effect waves-light add-feed-btn">
            <i className="material-icons">add</i>
          </a>
          <p>{subCounts + ' ' + feedCounts}</p>
        </div>
      </div>
    );
  }

  renderItems() {
    const feeds = this.state.feeds;
    const items = feeds.map(feed => {
      return (
        <VelTrans key={feed.id} enter={{animation: 'fadeIn'}} leave={{animation: 'fadeOut'}} runOnMount>
          <Feed key={feed.id} feed={feed}/>
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

