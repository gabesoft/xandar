'use strict';

const React = require('react');
const actions = require('../flux/search-actions');
const store = require('../flux/search-store');
const dispatcher = require('../flux/dispatcher');
const timeout = require('../util').timeout;
const postActions = require('../flux/post-actions');
const Query = require('../post-query').Query;
const QueryComponent = require('./post-query.jsx');
const sc = require('../constants').search;

module.exports = class PostQueryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { queries: [] };
    this.onStoreChange = this.onStoreChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onPin = this.onPin.bind(this);
  }

  onSelect(data) {
    const query = new Query(data.ast, data.data);

    actions.selectPostQuery({ data });
    postActions.loadPosts(query);
    timeout(sc.POST_QUERY_SAVE_DELAY).then(() => actions.savePostQuery({ query }));
  }

  onPin(query, value) {
    query.pin = value;
    timeout(sc.POST_QUERY_SAVE_DELAY).then(() => actions.savePostQuery({ query }));
  }

  onTitleChange(query, value) {
    query.title = value;
    timeout(sc.POST_QUERY_SAVE_DELAY).then(() => actions.savePostQuery({ query }));
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
    store.addListener(sc.STORE_CHANGE, this.onStoreChange, false);
    actions.loadPostQueries();
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case sc.SAVE_POST_QUERY_DONE:
          actions.loadPostQueries();
          break;
        default:
          break;
      }
    });
  }

  componentWillUnmount() {
    store.removeListener(sc.STORE_CHANGE, this.onStoreChange);
    dispatcher.unregister(this.tokenId);
  }

  render() {
    const queries = this.state
      .queries
      .map(data => {
        return (
          <QueryComponent
            key={data.id}
            query={data}
            onClick={this.onSelect}
            onPin={this.onPin}
            onTitleChange={this.onTitleChange}
          />
        );
      });

    return (
      <div className="post-query-list">
        <ul className="collection">
          {queries}
        </ul>
      </div>
    );
  }
};
