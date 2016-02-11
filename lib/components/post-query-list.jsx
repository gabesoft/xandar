'use strict';

const React = require('react');
const store = require('../flux/search-store');
const constants = require('../constants');
const actions = require('../flux/search-actions');
const Item = require('./post-query-item.jsx');

module.exports = class PostQueryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { queries: [] };
    this.onStoreChange = this.onStoreChange.bind(this);
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
  }

  render() {
    const queries = this.state.queries.map(query => {
      return (
        <Item key={query.id} query={query}/>
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
