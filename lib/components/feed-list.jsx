const React = require('react');
const api = require('../app/api');
const Feed = require('./feed.jsx');
const trans = require('trans');

module.exports = React.createClass({
  getInitialState() {
    return { feeds: [] };
  },

  componentDidMount() {
    api.feeds().then(data => {
      // TODO: use data.subscriptions instead of temp

      const tempSubscriptions = [
        {feedId: '563aec31d9ccd0b9cf91b804', userId: 'x'},
        {feedId: '563aec32d9ccd0b9cf91b89d', userId: 'x'},
        {feedId: '563aec32d9ccd0b9cf91b8d6', userId: 'x'},
        {feedId: '563aec33d9ccd0b9cf91b9f5', userId: 'x'},
      ];
      const tempNewCounts = [
        {feedId: '563aec31d9ccd0b9cf91b804', count: 4},
        {feedId: '563aec32d9ccd0b9cf91b89d', count: 37},
        {feedId: '563aec32d9ccd0b9cf91b8d6', count: 18},
        {feedId: '563aec33d9ccd0b9cf91b9f5', count: 2},
      ];
      const subscriptions = trans(tempSubscriptions)
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
      console.log(feeds);
      this.setState({ feeds: feeds });
    });
  },

  render() {
    const feeds = this.state.feeds;
    const items = feeds.map(feed => <Feed key={feed.id} {...feed}/>);
    return (
      <ul className="collapsible feed-list" dataCollapsible="expandable">{items}</ul>
    );
  }
});
