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

module.exports = class FeedList extends React.Component {
  constructor(props) {
    super(props);

    const feeds = store.getFeeds();
    this.state = {
      feeds,
      grouped: true,
      groupedFeeds: this.groupFeeds(feeds),
      closedGroups: { unsubscribed: true }
    };

    this.onStoreChange = this.onStoreChange.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.collapseAllGroups = this.collapseAllGroups.bind(this);
    this.expandAllGroups = this.expandAllGroups.bind(this);
    this.toggleGroupOpen = this.toggleGroupOpen.bind(this);
    this.toggleGroupFeeds = this.toggleGroupFeeds.bind(this);
    this.allGroupsCollapsed = this.allGroupsCollapsed.bind(this);
    this.allGroupsExpanded = this.allGroupsExpanded.bind(this);
    this.onFilterChange = debounce(this.onFilterChange.bind(this), 150);
    this.onAddFeedStart = this.onAddFeedStart.bind(this);
  }

  onAddFeedStart() {
    console.log('TODO: open add feed dialog');
  }

  onScroll(event) {
    this.setState({ scrolled: event.target.scrollTop > 0 });
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

  onFilterChange(event) {
    const filter = event.target.value.toLowerCase();
    const feeds = (filter === ':unread' || filter === ':new')
      ? this.filterByUnread()
      : this.filterByQuery(filter);
    this.updateFeeds(feeds);
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
      this.updateFeeds();
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    store.addListener(feedConstants.STORE_CHANGE, this.onStoreChange);
    actions.loadFeeds();
  }

  componentWillUnmount() {
    store.removeListener(feedConstants.STORE_CHANGE, this.onStoreChange);
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
      return (
        <FeedItem key={`${feed.id}-${index}`} feed={feed} className={className}/>
      );
    });
  }

  render() {
    const className = cls(
      'feed-list',
      this.props.className || '',
      this.state.grouped ? 'grouped' : 'ungrouped'
    );
    const listClass = cls('feed-list-items', this.state.scrolled ? 'scrolled' : null);

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
        <div onScroll={this.onScroll} className={listClass}>
          <ul>
            {this.state.grouped ? this.renderGroups() : this.renderItems()}
          </ul>
        </div>
      </div>
    );
  }
};
