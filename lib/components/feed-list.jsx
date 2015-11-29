const React = require('react');
const api = require('../app/api');
const Feed = require('./feed.jsx');
const trans = require('trans');
const Toast = require('../mixins/toast');
const VelTrans = require('velocity-react/velocity-transition-group');

module.exports = React.createClass({
  mixins: [Toast],

  getInitialState() {
    return { feeds: [] };
  },

  componentDidMount() {
    api.feeds().then(data => {
      // TODO: use data.newPosts instead of temp

      const tempNewCounts = [
        {feedId: '563aec31d9ccd0b9cf91b804', count: 4},
        {feedId: '563aec32d9ccd0b9cf91b89d', count: 37},
        {feedId: '563aec32d9ccd0b9cf91b8d6', count: 18},
        {feedId: '563aec33d9ccd0b9cf91b9f5', count: 2},
      ];
      const subscriptions = trans(data.subscriptions)
        .object('feedId', 'id')
        .value();
      const counts = trans(tempNewCounts)
        .object('feedId', 'count')
        .value();
      const feeds = trans(data.feeds)
        .mapff('id', 'subscriptionId')
        .mapff('id', 'newCount')
        .mapf('subscriptionId', subscriptions)
        .mapf('newCount', counts)
        .sort('title', 'toLowerCase')
        .value();
      this.setState({ feeds: feeds });
    });
  },

  onSubscribe(feed) {
    api.subscribe(feed.id)
      .fail(() => this.error(`Failed to subscribe to feed ${feed.title}`))
      .done(data => {
        this.updateSubscription(feed, data);
        this.success(`Subscribed to feed ${feed.title}`);
      });
  },

  onUnsubscribe(feed) {
    api.unsubscribe(feed.id, feed.subscriptionId)
      .fail(() => this.error(`Failed to unsubscribe from feed ${feed.title}`))
      .done(() => {
        this.updateSubscription(feed);
        this.success(`Unsubscribed from feed ${feed.title}`);
      });
  },

  onDelete(feed) {
    api.deleteFeed(feed.id)
      .fail(() => this.error(`Failed to delete feed ${feed.title}`))
      .done(() => {
        const index = this.state.feeds.findIndex(fd => fd.id === feed.id);
        if (index !== -1) {
          this.state.feeds.splice(index, 1);
          this.setState(this.state);
        }
        this.success(`Deleted feed ${feed.title}`);
      });
  },

  updateSubscription(feed, subscription) {
    trans(this.state.feeds)
      .filter('id', id => id === feed.id)
      .mapf('subscriptionId', () => (subscription || {}).id);
    this.setState(this.state);
  },

  subscriptionCount() {
    return trans(this.state.feeds).filter('subscriptionId', Boolean).count();
  },

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
  },

  renderItems() {
    const feeds = this.state.feeds;
    const items = feeds.map(feed => {
      return (
        <VelTrans key={feed.id} enter={{animation: 'fadeIn'}} leave={{animation: 'fadeOut'}} runOnMount>
          <Feed
            key={feed.id}
            feed={feed}
            onSubscribe={this.onSubscribe}
            onUnsubscribe={this.onUnsubscribe}
            onDelete={this.onDelete}
          />
        </VelTrans>
      ); });

    return (
      <ul className="collapsible feed-list">
        {items}
      </ul>
    );
  },

  render() {
    return (
      <div>
        {this.renderHeader()}
        {this.renderItems()}
      </div>
    );
  }
});

