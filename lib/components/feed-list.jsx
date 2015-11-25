const React = require('react');
const api = require('../app/api');
const Feed = require('./feed.jsx');

module.exports = React.createClass({
  getInitialState() {
    return { feeds: [] };
  },

  componentDidMount() {
    api.feeds().then(data => {
      this.setState({ feeds: data.feeds });
    });
  },

  render() {
    const feeds = this.state.feeds;
    return (
      <ul className="collection feed-list">
        {feeds.map(feed => <Feed {...feed}/>)}
      </ul>
    );
  }
});
