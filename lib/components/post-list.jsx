const React = require('react');
const ReactDOM = require('react-dom');
const Post = require('./post.jsx');
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
      loading: true,
      fullscreenPostIndex: 0,
      fullscreenHasNext: true
    };
    this.onStoreChange = this.onStoreChange.bind(this);
    this.onFullscreenClick = this.onFullscreenClick.bind(this);
    this.onFullscreenClose = this.onFullscreenClose.bind(this);
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

    if (this.fullscreenEl) {
      const ref = ReactDOM.findDOMNode(this.fullscreenEl);
      if (ref.requestFullscreen) {
        ref.requestFullscreen();
      } else if (ref.msRequestFullscreen) {
        ref.msRequestFullscreen();
      } else if (ref.mozRequestFullScreen) {
        ref.mozRequestFullScreen();
      } else if (ref.webkitRequestFullscreen) {
        ref.webkitRequestFullscreen();
      }
    }
  }

  onFullscreenClose() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
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

  componentDidMount() {
    store.addListener(pc.STORE_POSTS_CHANGE, this.onStoreChange);
    store.addListener(pc.STORE_POST_CHANGE, this.onStoreChange);
    actions.loadPosts(150);
  }

  componentWillUnmount() {
    store.removeListener(pc.STORE_POSTS_CHANGE, this.onStoreChange);
    store.removeListener(pc.STORE_POST_CHANGE, this.onStoreChange);
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
            onFullscreenClick={this.onFullscreenClick}
          />
        );
      });

    return (<ul className="collapsible collection">{items}</ul>);
  }

  render() {
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
      </div>
    );
  }
};
