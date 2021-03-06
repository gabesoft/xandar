'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Post = require('./post-item.jsx');
const PostDetail = require('./post-item-detail.jsx');
const constants = require('../constants');
const store = require('../flux/post-store');
const DelaySeries = require('../util').DelaySeries;

module.exports = class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: store.getPosts(),
      openPost: null
    };

    this.delay = new DelaySeries(2000);
    this.onStoreChange = this.onStoreChange.bind(this);
    this.onOpenPost = this.onOpenPost.bind(this);
    this.onOpenInCarousel = this.onOpenInCarousel.bind(this);
    this.onClosePost = this.onClosePost.bind(this);
    this.onScrollIntoView = this.onScrollIntoView.bind(this);
  }

  onScrollIntoView(node) {
    const el = ReactDOM.findDOMNode(node);
    el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  onOpenPost(post) {
    this.setState({ openPost: post._id });
    this.props.markAsRead(post);
  }

  onClosePost(post, scroll) {
    this.setState({
      openPost: null,
      highlightPost: this.state.openPost,
      scrollPost: scroll ? this.state.openPost : null
    });

    this.delay.run(() => this.setState({
      highlightPost: null,
      scrollPost: null
    }));
  }

  onStoreChange() {
    this.setState({ posts: store.getPosts(), loading: false });
  }

  componentDidMount() {
    store.addListener(constants.posts.STORE_CHANGE, this.onStoreChange, false);
  }

  componentWillUnmount() {
    store.removeListener(constants.posts.STORE_CHANGE, this.onStoreChange);
    this.delay.clear();
  }

  onOpenInCarousel(event, post, index) {
    this.props.onOpenInCarousel(post, index);
  }

  render() {
    const items = this.state.posts.map((post, index) => {
      const highlight = this.state.highlightPost === post._id ||
                        this.props.highlightPost === post._id;
      const scroll = this.state.scrollPost === post._id ||
                     this.props.highlightPost === post._id;

      const postItem = (
        <Post
          highlight={highlight}
          key={post._id}
          onOpen={this.onOpenPost}
          onOpenInCarousel={event => this.onOpenInCarousel(event, post, index)}
          onScrollIntoView={this.onScrollIntoView}
          post={post}
          scroll={scroll}
        />
      );
      const postDetailItem = (
        <PostDetail
          key={post._id}
          post={post}
          onClose={this.onClosePost}
          onOpenInCarousel={event => this.onOpenInCarousel(event, post, index)}
          onScrollIntoView={this.onScrollIntoView}
        />
      );
      return this.state.openPost === post._id ? postDetailItem : postItem;
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
