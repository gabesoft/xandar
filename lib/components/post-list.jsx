const React = require('react');
const ReactDOM = require('react-dom');
const Post = require('./post.jsx');
const util = require('../util');
const timeout = util.timeout;
const ct = require('../constants');
const pc = ct.posts;
const store = require('../flux/post-store');
const actions = require('../flux/post-actions');
const Content = require('./post-content.jsx');

module.exports = class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: store.getPosts(),
      limit: 50,
      loading: true,
      fullscreenPostIndex: 0,
      fullscreenHasNext: true
    };
    this.onStoreChange = this.onStoreChange.bind(this);
    this.onFullscreenClick = this.onFullscreenClick.bind(this);
    this.onFullscreenClose = this.onFullscreenClose.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.onFullscreenExit = this.onFullscreenExit.bind(this);
  }

  markPostAsRead(post) {
    if (post) {
      const data = post._source;
      if (data.read !== true) {
        data.read = true;
        actions.savePost(post);
      }
    }
  }

  onLoadMore() {
    actions.addPosts(this.state.posts.length, this.state.limit);
  }

  onFullscreenClick(postIndex) {
    this.updateFullscreenIndex(postIndex);
    this.markPostAsRead(this.state.fullscreenPost);

    const ref = ReactDOM.findDOMNode(this.fullscreenEl);
    util.fullscreenEnter(ref);
  }

  onFullscreenClose() {
    util.fullscreenExit();
  }

  updateFullscreenIndex(index) {
    const max = this.state.posts.length - 1;
    index = Math.max(0, Math.min(max, index));
    this.setState({
      fullscreenPostIndex: index,
      fullscreenPost: this.state.posts[index],
      fullscreenHasNext: index < max,
      fullscreenHasPrev: index > 0
    });
  }

  onFullscreenNav(dir) {
    const next = dir === 'next';
    const add = next ? +1 : -1;
    this.updateFullscreenIndex(this.state.fullscreenPostIndex + add);
    this.markPostAsRead(this.state.fullscreenPost);
  }

  onStoreChange() {
    this.setState({ posts: store.getPosts(), loading: false });
  }

  onFullscreenExit() {
    if (util.fullscreenOff()) {
      this.setState({
        fullscreenClosedId: this.state.fullscreenPost._id
      });
      timeout(pc.CLOSED_ACTIVE_DELAY).then(() => this.setState({
        fullscreenClosedId: null
      }));
    }
  }

  componentDidMount() {
    store.addListener(pc.STORE_POSTS_CHANGE, this.onStoreChange, false);
    store.addListener(pc.STORE_POST_CHANGE, this.onStoreChange, false);
    util.addFullscreenChangeListener(this.onFullscreenExit);
    actions.loadPosts(this.state.posts.length, this.state.limit);
  }

  componentWillUnmount() {
    store.removeListener(pc.STORE_POSTS_CHANGE, this.onStoreChange);
    store.removeListener(pc.STORE_POST_CHANGE, this.onStoreChange);
    util.removeFullscreenChangeListener(this.onFullscreenExit);
  }

  renderPosts() {
    const items = this.state
      .posts
      .map((data, index) => {
        return (
          <Post
            key={data._id}
            post={data}
            postIndex={index}
            closed={this.state.fullscreenClosedId === data._id}
            onFullscreenClick={this.onFullscreenClick}
          />
        );
      });

    return (<ul className="collapsible collection">{items}</ul>);
  }

  render() {
    const moreButton = (
      <a className="waves-effect waves-light btn-large" onClick={this.onLoadMore}>
        Load More (Showing {this.state.posts.length} of {store.getTotalPosts()})
      </a>
    );
    return (
      <div className="post-list">
        {this.renderPosts()}
        <Content
          className="post-content-fullscreen"
          ref={el => this.fullscreenEl = el}
          onFullscreenClose={this.onFullscreenClose}
          onPrev={() => this.onFullscreenNav('prev')}
          onNext={() => this.onFullscreenNav('next')}
          post={this.state.fullscreenPost || { _source: { post: {} } }}
          hasNext={this.state.fullscreenHasNext}
          hasPrev={this.state.fullscreenHasPrev}
        />
        {store.hasMore() ? moreButton : null}
      </div>
    );
  }
};
