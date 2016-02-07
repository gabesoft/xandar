'use strict';

const React = require('react');
const store = require('../flux/feed-store');
const actions = require('../flux/feed-actions');
const constants = require('../constants');
const feedConstants = constants.feeds;
const Feed = require('./feed.jsx');

module.exports = class FeedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feeds: store.getFeeds()
    };

    this.onStoreChange = this.onStoreChange.bind(this);
  }

  onStoreChange(data) {
    if (data.type === 'feeds') {
      this.setState({ feeds: store.getFeeds(), loading: false });
    }
  }

  componentDidMount() {
    store.addListener(feedConstants.STORE_CHANGE, this.onStoreChange);
    actions.loadFeeds();
  }

  componentWillUnmount() {
    store.removeListener(feedConstants.STORE_CHANGE, this.onStoreChange);
  }

  render() {
    const items = this.state.feeds.map(feed => (<Feed key={feed.id} feed={feed}/>));

    return (
      <div className={this.props.className}>
        <div className="feed-list-header">

        </div>
        <ul className="feed-list">
          {items}
        </ul>
      </div>
    );
  }
};
