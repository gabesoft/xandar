const React = require('react');
const api = require('../app/api');
const Feed = require('./feed.jsx');
const trans = require('trans');
const Materialize = window.Materialize;

module.exports = React.createClass({
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
        .object('feedId', 'userId')
        .value();
      const counts = trans(tempNewCounts)
        .object('feedId', 'count')
        .value();
      const feeds = trans(data.feeds)
        .mapff('id', 'subscribed')
        .mapff('id', 'newCount')
        .mapf('subscribed', subscriptions, Boolean)
        .mapf('newCount', counts)
        .value();
      this.setState({ feeds: feeds });
    });
  },

  onSubscribe(feed) {
    api.subscribe(feed.id)
      .done(() => {
        this.updateSubscription(feed, true);
        Materialize.toast(`Subscribed to feed ${feed.title}`, 2000, 'success');
      })
      .fail(() => {
        Materialize.toast(`Failed to subscribe to feed ${feed.title}`, 2000, 'error');
      });
  },

  onUnsubscribe(feed) {
    api.unsubscribe(feed.id)
      .done(() => {
        this.updateSubscription(feed, false);
        Materialize.toast(`Unsubscribed from feed ${feed.title}`, 2000, 'success');
      })
      .fail(() => {
        Materialize.toast(`Failed to unsubscribe from feed ${feed.title}`, 2000, 'error');
      });
  },

  updateSubscription(feed, value) {
    trans(this.state.feeds)
      .filter('id', id => id === feed.id)
      .mapf('subscribed', () => value);
    this.setState(this.state);
  },

  subscriptionCount() {
    return trans(this.state.feeds)
      .filter('subscribed', Boolean)
      .value()
      .length;
  },

  render() {
    const feeds = this.state.feeds;
    const items = feeds.map(feed => {
      return (
        <Feed
          key={feed.id}
          feed={feed}
          onSubscribe={this.onSubscribe}
          onUnsubscribe={this.onUnsubscribe}
        />
      ); });
    return (
      <div>
        <div className="card blue-grey darken-1">
          <div className="card-content white-text right-align">
            <p>
              {this.subscriptionCount() + ' Subscriptions'}
            </p>
          </div>
        </div>
        <ul className="collapsible feed-list" dataCollapsible="expandable">{items}</ul>
      </div>
    );
  }
});
