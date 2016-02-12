'use strict';

const React = require('react');
const Post = require('./post-item.jsx');
const constants = require('../constants');
const actions = require('../flux/post-actions');
const store = require('../flux/post-store');

module.exports = class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: store.getPosts()
    };
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  loadPosts(add) {
    const load = add ? 'addPosts' : 'loadPosts';
    actions[load](this.searchQuery, this.state.posts.length);
  }

  onStoreChange() {
    this.setState({ posts: store.getPosts(), loading: false });
  }

  componentDidMount() {
    store.addListener(constants.posts.STORE_CHANGE, this.onStoreChange, false);
    this.loadPosts();
  }

  componentWillUnmount() {
    store.removeListener(constants.posts.STORE_CHANGE, this.onStoreChange);
  }

  render() {
    const items = this.state.posts.map((post, index) => {
      return <Post key={post._id} index={index} post={post}/>;
    });

    return (
      <div className="post-list">
        <div className="post-list-header">
          <span></span>
        </div>
        <div className="post-list-items">
          <ul>{items}</ul>
        </div>
      </div>
    );
  }
};
