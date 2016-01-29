const React = require('react');
const ReactDOM = require('react-dom');
const Post = require('./post.jsx');
const Loader = require('./loader.jsx');
const util = require('../util');
const timeout = util.timeout;
const ct = require('../constants');
const pc = ct.posts;
const sc = ct.search;
const store = require('../flux/post-store');
const dispatcher = require('../flux/dispatcher');
const actions = require('../flux/post-actions');
const Content = require('./post-content.jsx');
const toast = require('../toast').toast;

module.exports = class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: store.getPosts(),
      loading: true,
      fullscreenPostIndex: 0,
      fullscreenHasNext: true
    };
    this.onStoreChange = this.onStoreChange.bind(this);
    this.onFullscreenClick = this.onFullscreenClick.bind(this);
    this.onFullscreenClose = this.onFullscreenClose.bind(this);
    this.onLoadMore = () => this.loadPosts(true);
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
    const safeIndex = Math.max(0, Math.min(max, index));
    this.setState({
      fullscreenPostIndex: safeIndex,
      fullscreenPost: this.state.posts[safeIndex],
      fullscreenHasNext: safeIndex < max,
      fullscreenHasPrev: safeIndex > 0
    });
    if (safeIndex > index) {
      toast.warn('At top');
    } else if (safeIndex < index) {
      toast.warn('At end');
    }
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

  loadPosts(add) {
    const load = add ? 'addPosts' : 'loadPosts';
    actions[load](this.searchQuery, this.state.posts.length);
  }

  componentDidMount() {
    store.addListener(pc.STORE_CHANGE, this.onStoreChange, false);
    util.addFullscreenChangeListener(this.onFullscreenExit);
    this.loadPosts();
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case sc.UPDATE_QUERY_SEARCH:
          this.searchQuery = action.query;
          break;
        case sc.SELECT_POST_QUERY:
          this.searchQuery = action.data;
          break;
        default:
          break;
      }
    });
  }

  componentWillUnmount() {
    store.removeListener(pc.STORE_CHANGE, this.onStoreChange);
    util.removeFullscreenChangeListener(this.onFullscreenExit);
    dispatcher.unregister(this.tokenId);
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
    const loader = (<Loader size="medium" className="post-list-loader"/>);

    return (
      <div className="post-list">
        {this.state.loading ? loader : this.renderPosts()}
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
        {(store.hasMore() && !this.state.loading) ? moreButton : null}
      </div>
    );
  }
};
