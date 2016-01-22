const React = require('react');
const actions = require('../flux/search-actions');
const store = require('../flux/search-store');
const sc = require('../constants').search;

module.exports = class PostQueryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { queries: [] };
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  onStoreChange() {
    console.log('change', store.getPostQueries());
    this.setState({ queries: store.getPostQueries(), loading: false });
  }

  componentDidMount() {
    store.addListener(sc.STORE_POST_QUERIES_CHANGE, this.onStoreChange, false);
    actions.loadPostQueries();
  }

  componentWillUnmount() {
    store.removeListener(sc.STORE_POST_QUERIES_CHANGE, this.onStoreChange);
  }

  render() {
    const queries = this.state
      .queries
      .map((data, index) => {
        return (
          <li key={data.id} queryIndex={index}>
          {data.text}
          </li>
        );
      });

    return (
      <div className="post-query-list">
        {queries}
      </div>
    );
  }
};
