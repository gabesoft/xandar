'use strict';

const React = require('react');
const SidePanel = require('./collapsible-panel.jsx');
const Loader = require('./loader.jsx');
const Header = require('./nav-header.jsx');
const FeedList = require('./feed-list.jsx');
const PostQueryList = require('./post-query-list.jsx');
const PostList = require('./post-list.jsx');
const Carousel = require('./carousel.jsx');
const Scrolled = require('./scrolled.jsx');
const actions = require('../flux/post-actions');
const store = require('../flux/post-store');
const timeout = require('../util').timeout;
const dispatcher = require('../flux/dispatcher');
const constants = require('../constants');
const cls = require('../util').cls;

module.exports = class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { carouselIndex: null, loading: false };
    this.onScroll = this.onScroll.bind(this);
    this.onOpenInCarousel = this.onOpenInCarousel.bind(this);
    this.onCarouselClose = this.onCarouselClose.bind(this);
    this.onCarouselLeft = this.onCarouselLeft.bind(this);
    this.onCarouselRight = this.onCarouselRight.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
  }

  componentDidMount() {
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case constants.posts.ADD_POSTS_DONE:
          this.setState({ loading: false });
          break;
        case constants.posts.ADD_POSTS_FAIL:
          this.setState({ loading: false });
          break;
        default:
          break;
      }
    });
    this.loadMorePosts();
    timeout(500).then(() => this.loadMorePosts());
  }

  componentWillUnmount() {
    dispatcher.unregister(this.tokenId);
  }

  markAsRead(post) {
    this.updateReadStatus(post, true);
  }

  markAsUnread(post) {
    this.updateReadStatus(post, false);
  }

  updateReadStatus(post, read) {
    if (post._source.read !== read) {
      post._source.read = read;
      actions.savePost(post);
    }
  }

  loadMorePosts() {
    if (this.state.loading) {
      return;
    }

    const query = null; // TODO: use the current query here
    const total = store.getTotalPostCount();
    const count = store.getPostCount();
    if (total === 0 || count < total) {
      actions.addPosts(query, count);
      this.setState({ loading: true });
    }
  }

  onOpenInCarousel(post, index) {
    this.setState({ carouselIndex: index });
    this.markAsRead(post);
  }

  onCarouselClose() {
    this.setState({
      carouselIndex: null,
      carouselPost: store.getPostByIndex(this.state.carouselIndex)
    });
    timeout(2000).then(() => this.setState({ carouselPost: null }));
  }

  onCarouselMove(dir) {
    const index = dir === 'left' ?
                  Math.max(0, this.state.carouselIndex - 1) :
                  Math.min(store.getPostCount() - 1, this.state.carouselIndex + 1);
    const post = store.getPostByIndex(index);

    this.setState({ carouselIndex: index });
    this.markAsRead(post);

    return index;
  }

  onCarouselLeft() {
    this.onCarouselMove('left');
  }

  onCarouselRight() {
    const index = this.onCarouselMove('right');
    if (store.getPostCount() - index < constants.posts.POST_COUNT / 2) {
      this.loadMorePosts();
    }
  }

  onScroll(event) {
    if (this.state.carouselIndex !== null) {
      return;
    }

    const el = event.target;
    const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight);
    const scrollUp = el.scrollTop > this.lastScrollTop;

    this.lastScrollTop = el.scrollTop;

    if (scrolled > 0.70 && scrollUp) {
      this.loadMorePosts();
    }
  }

  renderCarousel() {
    const post = store.getPostByIndex(this.state.carouselIndex);
    return (
      <Carousel
        post={post}
        index={this.state.carouselIndex}
        onMoveLeft={this.onCarouselLeft}
        onMoveRight={this.onCarouselRight}
        onClose={this.onCarouselClose}
      />
    );
  }

  render() {
    const user = this.props.route.user;
    const loader = <Loader size="big" className="app-content-loader"/>;
    const postList = (
      <PostList
        onOpenInCarousel={this.onOpenInCarousel}
        markAsRead={this.markAsRead}
        highlightPost={(this.state.carouselPost || {})._id}
      />
    );
    const loadingFirst = this.state.loading && store.getPostCount() === 0;
    const loadingMore = this.state.loading && store.getPostCount() > 0;
    const centerClass = cls('app-content-center', loadingMore ? 'loading-more' : null);

    return (
      <div className="app-main">
        <input hidden value={user.id} readOnly/>
        <Header className="app-header" user={user}/>

        <div className="app-content">
          <SidePanel className="app-content-left left" direction="1">
            <FeedList/>
          </SidePanel>

          <Scrolled
            onScroll={this.onScroll}
            disabled={this.state.carouselIndex !== null}
            className={centerClass}>
            {this.state.carouselIndex === null ? postList : this.renderCarousel()}
          </Scrolled>

          <SidePanel className="app-content-right right" direction="-1">
            <PostQueryList/>
          </SidePanel>

          {loadingFirst ? loader : null}
        </div>

        <div className="app-footer"></div>
      </div>
    );
  }
};
