const React = require('react');
const Post = require('./post.jsx');
const ct = require('../constants');
const pc = ct.posts;
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
    actions.loadPosts(80);
  }

  componentWillUnmount() {
    store.removeListener(pc.STORE_POSTS_CHANGE, this.onStoreChange);
  }

  renderPosts() {
    const items = this.state
      .posts
      .map(data => <Post key={data._id} post={data}/>);

    return (
      <ul className="collapsible post-list collection">{items}</ul>
    );
  }

  render() {
    return (
      <div>{ this.renderPosts() }</div>
    );
  }
};
