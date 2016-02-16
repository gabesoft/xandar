'use strict';

const React = require('react');
const SidePanel = require('./collapsible-panel.jsx');
const Header = require('./nav-header.jsx');
const FeedList = require('./feed-list.jsx');
const PostQueryList = require('./post-query-list.jsx');
const PostList = require('./post-list.jsx');
const Carousel = require('./carousel.jsx');
const cls = require('../util').cls;
const actions = require('../flux/post-actions');
const store = require('../flux/post-store');
const timeout = require('../util').timeout;

module.exports = class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { scrolled: false, carouselIndex: null };
    this.onScroll = this.onScroll.bind(this);
    this.onOpenInCarousel = this.onOpenInCarousel.bind(this);
    this.onCarouselClose = this.onCarouselClose.bind(this);
    this.onCarouselLeft = this.onCarouselLeft.bind(this);
    this.onCarouselRight = this.onCarouselRight.bind(this);
  }

  componentDidMount() {
    this.loadMorePosts();
    timeout(500).then(() => this.loadMorePosts());
  }

  loadMorePosts() {
    const query = null; // TODO: use the current query here
    const total = store.getTotalPostCount();
    const count = store.getPostCount();
    if (total === 0 || count < total) {
      actions.addPosts(query, count);
    }
  }

  onOpenInCarousel(post, index) {
    /* console.log(index); // TODO: remove */
    this.setState({ carouselIndex: index });
  }

  onCarouselClose() {
    this.setState({
      carouselIndex: null,
      carouselPost: store.getPostByIndex(this.state.carouselIndex)
    });
    timeout(2000).then(() => this.setState({ carouselPost: null }));
  }

  onCarouselLeft() {
    this.setState({
      carouselIndex: Math.max(0, this.state.carouselIndex - 1)
    });
  }

  onCarouselRight() {
    const index = Math.min(store.getPostCount() - 1, this.state.carouselIndex + 1);

    this.setState({ carouselIndex: index });

    if (store.getPostCount() - index < 10) {
      this.loadMorePosts();
    }
  }

  onScroll(event) {
    if (this.state.carouselIndex !== null) {
      this.setState({ scrolled: false });
      return;
    }

    this.setState({ scrolled: event.target.scrollTop > 0 });
    const el = event.target;
    const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight);
    const scrollUp = el.scrollTop > this.lastScrollTop;

    this.lastScrollTop = el.scrollTop;

    if (scrolled > 0.75 && scrollUp) {
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
    const centerClass = cls('app-content-center', this.state.scrolled ? 'scrolled' : null);
    const postList = (
      <PostList
        onOpenInCarousel={this.onOpenInCarousel}
        highlightPost={(this.state.carouselPost || {})._id}
      />
    );

    return (
      <div className="app-main">
        <input hidden value={user.id} readOnly/>
        <Header className="app-header" user={user}/>

        <div className="app-content">
          <SidePanel className="app-content-left left" direction="1">
            <FeedList/>
          </SidePanel>

          <div onScroll={this.onScroll} className={centerClass}>
            {this.state.carouselIndex === null ? postList : this.renderCarousel()}
          </div>

          <SidePanel className="app-content-right right" direction="-1">
            <PostQueryList/>
          </SidePanel>
        </div>

        <div className="app-footer"></div>
      </div>
    );
  }
};
