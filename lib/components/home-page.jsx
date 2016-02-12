'use strict';

const React = require('react');
const SidePanel = require('./collapsible-panel.jsx');
const Header = require('./nav-header.jsx');
const FeedList = require('./feed-list.jsx');
const PostQueryList = require('./post-query-list.jsx');
const PostList = require('./post-list.jsx');
const cls = require('../util').cls;
const actions = require('../flux/post-actions');
const store = require('../flux/post-store');
const timeout = require('../util').timeout;

module.exports = class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { scrolled: false };
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    timeout(300).then(() => this.loadMorePosts());
  }

  componentWillUnmount() {

  }

  loadMorePosts() {
    const query = null; // TODO: use the current query here
    actions.addPosts(query, store.getPostsCount());
  }

  onScroll(event) {
    this.setState({ scrolled: event.target.scrollTop > 0 });
    const el = event.target;
    const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight);
    const scrollUp = el.scrollTop > this.lastScrollTop;

    this.lastScrollTop = el.scrollTop;

    if (scrolled > 0.70 && scrollUp) {
      this.loadMorePosts();
    }
  }

  render() {
    const user = this.props.route.user;
    const centerClass = cls('app-content-center', this.state.scrolled ? 'scrolled' : null);

    return (
      <div className="app-main">
        <input hidden value={user.id} readOnly/>
        <Header className="app-header" user={user}/>

        <div className="app-content">
          <SidePanel className="app-content-left left" direction="1">
            <FeedList/>
          </SidePanel>

          <div onScroll={this.onScroll} className={centerClass}>
            <PostList/>
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
