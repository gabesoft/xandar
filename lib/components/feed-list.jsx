'use strict';

const React = require('react');
const store = require('../flux/feed-store');
const actions = require('../flux/feed-actions');
const debounce = require('../util').debounce;
const cls = require('../util').cls;
const constants = require('../constants');
const feedConstants = constants.feeds;
const FeedItem = require('./feed-item.jsx');
const FeedGroup = require('./feed-group.jsx');
const Header = require('./feed-list-header.jsx');
const trans = require('trans');
const Scrolled = require('./scrolled.jsx');
const dispatcher = require('../flux/dispatcher');

module.exports = class FeedList extends React.Component {
  constructor(props) {
    super(props);

    const feeds = store.getFeeds();
    this.state = {
      feeds,
      filter: null,
      grouped: true,
      groupedFeeds: this.groupFeeds(feeds),
      closedGroups: { unsubscribed: true }
    };

    this.onStoreChange = this.onStoreChange.bind(this);
    this.collapseAllGroups = this.collapseAllGroups.bind(this);
    this.expandAllGroups = this.expandAllGroups.bind(this);
    this.toggleGroupOpen = this.toggleGroupOpen.bind(this);
    this.toggleGroupFeeds = this.toggleGroupFeeds.bind(this);
    this.allGroupsCollapsed = this.allGroupsCollapsed.bind(this);
    this.allGroupsExpanded = this.allGroupsExpanded.bind(this);
    this.onFilterChange = debounce(this.onFilterChange.bind(this), 150);
    this.onAddFeedStart = this.onAddFeedStart.bind(this);
    this.onFeedMarkAsRead = this.onFeedMarkAsRead.bind(this);
    this.onFeedEditClick = this.onFeedEditClick.bind(this);
    this.onListScroll = this.onListScroll.bind(this);
  }

  onAddFeedStart() {
    console.log('TODO: open add feed dialog');
  }

  onListScroll() {
    actions.hideEditFeedPopup();
    this.setState({ editOpenFeedId: null });
  }

  onFeedEditClick(feed) {
    this.setState({ editOpenFeedId: feed.id });
  }

  onFeedMarkAsRead(feed) {
    feed.subscription.unreadCount = 0;
    actions.markPostsAsRead(feed);
    this.setState({ feeds: this.state.feeds });
  }

  updateFeeds(feeds) {
    feeds = feeds || store.getFeeds() || [];
    this.setState({
      feeds,
      groupedFeeds: this.groupFeeds(feeds)
    });
  }

  filterByQuery(filter) {
    return store
      .getFeeds()
      .filter(feed => {
        const author = (feed.author || '');
        const title = ((feed.subscription || {}).title || feed.title || '');
        return title.toLowerCase().match(filter) || author.toLowerCase().match(filter);
      });
  }

  filterByUnread() {
    return store
      .getFeeds()
      .filter(feed => feed.subscription && feed.subscription.unreadCount > 0);
  }

  applyFilter(filter) {
    filter = filter || this.state.filter;

    const feeds = (filter === ':unread' || filter === ':new')
      ? this.filterByUnread()
      : this.filterByQuery(filter);

    this.updateFeeds(feeds);
  }

  onFilterChange(event) {
    const filter = event.target.value.toLowerCase();
    this.setState({ filter });
    this.applyFilter(filter);
  }

  getAllGroups(groupedFeeds) {
    return trans(groupedFeeds || this.state.groupedFeeds || [])
      .object('key', 'key')
      .value();
  }

  collapseAllGroups() {
    this.setState({ closedGroups: this.getAllGroups() });
  }

  expandAllGroups() {
    this.setState({ closedGroups: {} });
  }

  closedGroupsCount() {
    return trans(this.state.closedGroups).array().filter('value').count();
  }

  allGroupsCollapsed() {
    const closed = this.closedGroupsCount();
    const all = this.state.groupedFeeds.length;
    return closed === all;
  }

  allGroupsExpanded() {
    return this.closedGroupsCount() === 0;
  }

  toggleGroupFeeds(value) {
    this.setState({ grouped: value });
  }

  toggleGroupOpen(group, open) {
    this.state.closedGroups[group.key] = !open;
    this.setState({ closedGroups: this.state.closedGroups });
  }

  groupFeeds(feeds) {
    const comparer = (tag1, tag2) => {
      if (tag1 === 'unsubscribed') {
        return 1;
      } else if (tag2 === 'unsubscribed') {
        return -1;
      } else if (tag1 === 'uncategorized') {
        return 1;
      } else if (tag2 === 'uncategorized') {
        return -1;
      } else {
        return tag1.localeCompare(tag2);
      }
    };

    return trans(feeds)
      .group(null, null, feed => {
        if (!feed.subscription) {
          return 'unsubscribed';
        } else {
          return (feed.subscription.tags || [])[0] || 'uncategorized';
        }
      })
      .sort('key', 'toLowerCase', comparer)
      .value();
  }

  onStoreChange(data) {
    if (data.type === 'feeds') {
      if (this.state.filter) {
        this.applyFilter();
      } else {
        this.updateFeeds();
      }
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    store.addListener(feedConstants.STORE_CHANGE, this.onStoreChange);
    actions.loadFeeds();
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case constants.feeds.EDIT_FEED_POPUP_CLOSED:
          this.setState({ editOpenFeedId: null });
          break;
        default:
          break;
      }
    });
  }

  componentWillUnmount() {
    store.removeListener(feedConstants.STORE_CHANGE, this.onStoreChange);
    dispatcher.unregister(this.tokenId);
  }

  renderGroups() {
    const items = [];

    this.state.groupedFeeds.forEach((group, index) => {
      const key = `${group.key}-${index}`;
      const className = `feed-group-items group-${group.key}`;
      const component = (
        <FeedGroup
          key={key}
          group={group}
          count={group.value.length}
          closed={this.state.closedGroups[group.key]}
          onToggleGroupOpen={this.toggleGroupOpen}
        />
      );
      const children = (
        <li key={`${key}-items`} className={className}>
          <ul>{this.renderItems(group.value)}</ul>
        </li>
      );

      items.push(component);
      items.push(children);
    });

    return items;
  }

  renderItems(feeds, className) {
    feeds = feeds || this.state.feeds;

    return feeds.map((feed, index) => {
      const itemClass = cls(
        className,
        this.state.editOpenFeedId === feed.id ? 'edit-open' : null
      );

      return (
        <FeedItem
          key={`${feed.id}-${index}`}
          feed={feed}
          className={itemClass}
          onMarkAsRead={this.onFeedMarkAsRead}
          onEditClick={this.onFeedEditClick}
        />
      );
    });
  }

  render() {
    const className = cls(
      'feed-list',
      this.props.className || '',
      this.state.grouped ? 'grouped' : 'ungrouped'
    );

    return (
      <div className={className}>
        <Header
          toggleGroupFeeds={this.toggleGroupFeeds}
          collapseAllGroups={this.collapseAllGroups}
          expandAllGroups={this.expandAllGroups}
          allGroupsExpanded={this.allGroupsExpanded()}
          allGroupsCollapsed={this.allGroupsCollapsed()}
          feedCount={this.state.feeds.length}
          onFilterChange={this.onFilterChange}
          onAddFeed={this.onAddFeedStart}
          grouped={this.state.grouped}
        />
        <Scrolled className="feed-list-items" onScroll={this.onListScroll}>
          <ul>
            {this.state.grouped ? this.renderGroups() : this.renderItems()}
          </ul>
        </Scrolled>
      </div>
    );
  }
};
