'use strict';

const latestPattern = /:latest(\d+)?(h|d)?/i;
const addedPattern = /:added/i;
const unreadPattern = /:unread|:new/;
const allPattern = /:all/;
const tagPattern = /^:(.+)$/;
const unitFactor = { h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
const showMaxFeeds = 100;

const React = require('react');
const ReactDOM = require('react-dom');
const store = require('../flux/feed-store');
const actions = require('../flux/feed-actions');
const cls = require('../util').cls;
const constants = require('../constants');
const feedConstants = constants.feeds;
const FeedItem = require('./feed-item.jsx');
const FeedGroup = require('./feed-group.jsx');
const Header = require('./feed-list-header.jsx');
const trans = require('trans');
const Scrolled = require('./scrolled.jsx');
const dispatcher = require('../flux/dispatcher');
const Store = require('../store').Store;
const defaultGroups = () => ({ unsubscribed: true });
const DelaySeries = require('../util').DelaySeries;

module.exports = class FeedList extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({
      filter: null,
      grouped: true,
      closedGroups: defaultGroups()
    }, this.computeFeedsData());

    this.delay = new DelaySeries(2000);
    this.store = new Store({ prefix: 'side-feed-list' });
    this.onStoreChange = this.onStoreChange.bind(this);
    this.collapseAllGroups = this.collapseAllGroups.bind(this);
    this.expandAllGroups = this.expandAllGroups.bind(this);
    this.toggleGroupOpen = this.toggleGroupOpen.bind(this);
    this.toggleGroupFeeds = this.toggleGroupFeeds.bind(this);
    this.allGroupsCollapsed = this.allGroupsCollapsed.bind(this);
    this.allGroupsExpanded = this.allGroupsExpanded.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onFeedMarkAsRead = this.onFeedMarkAsRead.bind(this);
    this.onFeedEditClick = this.onFeedEditClick.bind(this);
    this.onListScroll = this.onListScroll.bind(this);
    this.onScrollIntoView = this.onScrollIntoView.bind(this);
  }

  onListScroll() {
    actions.hideEditFeedPopup();
    this.setState({ editOpenFeedId: null });
  }

  onScrollIntoView(node) {
    const el = ReactDOM.findDOMNode(node);
    el.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }

  onFeedEditClick(feed) {
    this.setState({ editOpenFeedId: feed._id });
  }

  onFeedMarkAsRead(feed) {
    feed.subscription.unreadCount = 0;
    actions.markPostsAsRead(feed);
    this.setState({ feeds: this.state.feeds });
  }

  computeFeedsData(feeds) {
    feeds = feeds || store.getFeeds() || [];

    const showFeeds = (this.state && this.state.filter === ':all')
                    ? feeds : feeds.slice(0, showMaxFeeds);

    const subscriptionCount = feeds
      .map(feed => feed.subscription)
      .filter(Boolean)
      .length;

    return {
      feedCount: feeds.length,
      feeds: showFeeds,
      groupedFeeds: this.groupFeeds(showFeeds),
      subscriptionCount
    };
  }

  updateFeeds(feeds) {
    this.setState(this.computeFeedsData(feeds));
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

  filterByTag(filter) {
    const match = filter.match(tagPattern);
    const value = match[1];
    return store
      .getFeeds()
      .filter(feed => {
        const subscription = feed.subscription || {};
        const tags = new Set(subscription.tags);
        return tags.has(value);
      });
  }

  filterByLatest(filter) {
    const match = filter.match(latestPattern);
    const value = parseInt(match[1] || 24, 10);
    const unit = match[2] || 'h';
    const duration = value * unitFactor[unit];

    return store
      .getFeeds()
      .filter(feed => {
        const diff = Date.now() - new Date(feed.lastPostDate);
        return feed.subscription && feed.lastPostDate && diff <= duration;
      });
  }

  sortByRecentlyAdded() {
    return trans(store.getFeeds())
      .filter('subscription')
      .sort('subscription.createdAt:descending')
      .take(showMaxFeeds)
      .value();
  }

  filterByUnread() {
    return store
      .getFeeds()
      .filter(feed => feed.subscription && feed.subscription.unreadCount > 0);
  }

  applyFilter(filter) {
    filter = filter || this.state.filter;

    let feeds = null;

    if (filter.match(allPattern)) {
      feeds = store.getFeeds();
    } else if (filter.match(unreadPattern)) {
      feeds = this.filterByUnread();
    } else if (filter.match(latestPattern)) {
      feeds = this.filterByLatest(filter);
    } else if (filter.match(addedPattern)) {
      feeds = this.sortByRecentlyAdded(filter);
    } else if (filter.match(tagPattern)) {
      feeds = this.filterByTag(filter);
    } else {
      feeds = this.filterByQuery(filter);
    }

    this.store.set('filter', filter);
    this.updateFeeds(feeds);
  }

  onFilterChange(filter) {
    const savedGroups = this.store.get('closedGroups') || defaultGroups();
    this.setState({
      filter,
      closedGroups: filter.length === 0 ? savedGroups : {}
    });
    this.applyFilter(filter);
  }

  getAllGroups(groupedFeeds) {
    return trans(groupedFeeds || this.state.groupedFeeds || [])
      .object('key', 'key')
      .value();
  }

  collapseAllGroups() {
    this.setState({ closedGroups: this.getAllGroups() });
    this.store.set('closedGroups', this.getAllGroups());
  }

  expandAllGroups() {
    this.setState({ closedGroups: {} });
    this.store.remove('closedGroups');
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
    this.store.set('grouped', value);
  }

  toggleGroupOpen(groupKey, open) {
    this.state.closedGroups[groupKey] = !open;
    this.setState({ closedGroups: this.state.closedGroups });
    this.store.set('closedGroups', this.state.closedGroups);
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
      .value() || [];
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

  onFeedAdded(data) {
    const feed = data.feed;
    const subscription = data.subscription;
    const groupKey = (subscription.tags[0] || 'uncategorized').toLowerCase();
    this.setState({ highlightFeedId: feed._id });
    this.toggleGroupOpen(groupKey, true);
    this.delay.run(() => this.setState({ highlightFeedId: null }));
  }

  componentDidMount() {
    store.addListener(feedConstants.STORE_CHANGE, this.onStoreChange);
    actions.loadFeeds();
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case constants.feeds.EDIT_FEED_POPUP_CLOSED:
          this.setState({ editOpenFeedId: null });
          break;
        case constants.feeds.ADD_FEED_DONE:
          this.onFeedAdded(action.data);
          break;
        default:
          break;
      }
    });
  }

  componentWillMount() {
    this.setState({
      closedGroups: this.store.get('closedGroups') || defaultGroups(),
      filter: this.store.get('filter'),
      grouped: this.store.get('grouped') !== false
    });
  }

  componentWillUnmount() {
    store.removeListener(feedConstants.STORE_CHANGE, this.onStoreChange);
    dispatcher.unregister(this.tokenId);
    this.delay.clear();
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
          onToggleGroupOpen={(groupItem, open) => this.toggleGroupOpen(groupItem.key, open)}
        />
      );
      const children = (
        <li key={`${key}-items`} className={className}>
          <ul>{this.state.closedGroups[group.key] ? null : this.renderItems(group.value)}</ul>
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
        this.state.editOpenFeedId === feed._id ? 'edit-open' : null
      );

      return (
        <FeedItem
          key={`${feed._id}-${index}`}
          feed={feed}
          className={itemClass}
          onMarkAsRead={this.onFeedMarkAsRead}
          onEditClick={this.onFeedEditClick}
          highlight={feed._id === this.state.highlightFeedId}
          onScrollIntoView={this.onScrollIntoView}
          showDelete={this.props.user.admin}
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
          feedCount={this.state.feedCount}
          subscriptionCount={this.state.subscriptionCount}
          onFilterChange={this.onFilterChange}
          filter={this.state.filter}
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
