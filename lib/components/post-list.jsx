const React = require('react');
const ct = require('../constants');
const pc = ct.posts;
const moment = require('moment');
const store = require('../flux/post-store');
const actions = require('../flux/post-actions');

module.exports = class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: store.getPosts(),
      loading: true
    };
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  onStoreChange() {
    this.setState({ posts: store.getPosts(), loading: false });
  }

  componentDidMount() {
    store.addListener(pc.STORE_POSTS_CHANGE, this.onStoreChange);
    actions.loadPosts(50);
  }

  componentWillUnmount() {
    store.removeListener(pc.STORE_POSTS_CHANGE, this.onStoreChange);
  }

  renderPosts() {
    const posts = this.state.posts;
    const items = posts.map(data => {
      const post = data._source.post;
      return (
        <li key={data._id}>
          <span className="feed-title">{data._source.title}</span>
          <span className="post-title">{post.title}</span>
          <span className="date right">{moment(post.date).fromNow(true)}</span>
        </li>
      );
    });

    return (
      <ul className="collapsible post-list">{items}</ul>
    );
  }

  render() {
    return (
      <div>{ this.renderPosts() }</div>
    );
  }
};
