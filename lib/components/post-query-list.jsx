'use strict';

const React = require('react');
const store = require('../flux/search-store');
const constants = require('../constants');
const actions = require('../flux/search-actions');
const Item = require('./post-query-item.jsx');
const dispatcher = require('../flux/dispatcher');

module.exports = class PostQueryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { queries: [] };
    this.onStoreChange = this.onStoreChange.bind(this);
    this.onPin = this.onPin.bind(this);
    this.onUnpin = this.onUnpin.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onTitleUpdate = this.onTitleUpdate.bind(this);
  }

  saveQuery(query) {
    this.setState({ queries: this.state.queries });
    actions.savePostQuery({ query });
  }

  onTitleUpdate(query, title) {
    query.title = title;
    this.saveQuery(query);
  }

  onSelect(query) {
    query.lastUsed = new Date();
    this.saveQuery(query);
  }

  onPinUpdate(query, value) {
    query.pinState = value;
    this.saveQuery(query);
  }

  onPin(query) {
    this.onPinUpdate(query, 1);
  }

  onUnpin(query) {
    this.onPinUpdate(query, 0);
  }

  onStoreChange(data) {
    if (data.type === 'post-queries') {
      this.setState({
        queries: store.getPostQueries(),
        loading: false
      });
    }
  }

  componentDidMount() {
    store.addListener(constants.search.STORE_CHANGE, this.onStoreChange, false);
    actions.loadPostQueries();
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case constants.search.SAVE_POST_QUERY_DONE:
          actions.loadPostQueries();
          break;
        default:
          break;
      }
    });
  }

  componentWillUnmount() {
    store.removeListener(constants.search.STORE_CHANGE, this.onStoreChange);
    dispatcher.unregister(this.tokenId);
  }

  render() {
    const queries = this.state.queries.map(query => {
      return (
        <Item
          key={query._id}
          query={query}
          onPin={this.onPin}
          onUnpin={this.onUnpin}
          onSelect={this.onSelect}
          onTitleUpdate={this.onTitleUpdate}
        />
      );
    });

    return (
      <div className="post-query-list">
        <ul className="post-query-list-items">
          {queries}
        </ul>
      </div>
    );
  }
};
