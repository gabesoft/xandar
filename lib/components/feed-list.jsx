'use strict';

const React = require('react');
const store = require('../flux/feed-store');
const actions = require('../flux/feed-actions');
const debounce = require('../util').debounce;
const constants = require('../constants');
const feedConstants = constants.feeds;
const FeedItem = require('./feed-item.jsx');
const FeedGroup = require('./feed-group.jsx');
const trans = require('trans');
const Button = require('./icon-button.jsx');

module.exports = class FeedList extends React.Component {
  constructor(props) {
    super(props);

    const feeds = store.getFeeds();
    this.state = {
      feeds,
      grouped: true,
      groupedFeeds: this.groupFeeds(feeds),
      closedGroups: {}
    };

    this.onStoreChange = this.onStoreChange.bind(this);
    this.collapseAllGroups = this.collapseAllGroups.bind(this);
    this.expandAllGroups = this.expandAllGroups.bind(this);
    this.toggleGroupOpen = this.toggleGroupOpen.bind(this);
    this.allGroupsCollapsed = this.allGroupsCollapsed.bind(this);
    this.allGroupsExpanded = this.allGroupsExpanded.bind(this);
    this.anyGroupsCollapsed = this.anyGroupsCollapsed.bind(this);
    this.anyGroupsExpanded = this.anyGroupsExpanded.bind(this);
    this.onFilterChange = debounce(this.onFilterChange.bind(this), 150);
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
    const feeds = (filter === ':unread')
      ? this.filterByUnread()
      : this.filterByQuery(filter);
    this.updateFeeds(feeds);
  }

  collapseAllGroups() {
    this.setState({
      closedGroups: trans(this.state.groupedFeeds).object('key', 'key').value()
    });
  }

  expandAllGroups() {
    this.setState({ closedGroups: {} });
  }

  allGroupsCollapsed() {
    const closed = trans(this.state.closedGroups).array().filter('value').count();
    const all = this.state.groupedFeeds.length;
    return closed === all;
  }

  anyGroupsCollapsed() {
    return !this.allGroupsExpanded();
  }

  allGroupsExpanded() {
    return Object.keys(this.state.closedGroups).length === 0;
  }

  anyGroupsExpanded() {
    return !this.allGroupsCollapsed();
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
    const grouped = this.state.grouped;
    const group = (
      <Button
        icon="group"
        onClick={() => this.toggleGroupFeeds(true)}
        title="Group feeds by first tag"
      />
    );
    const ungroup = (
      <Button
        icon="ungroup"
        title="Ungroup feeds"
        onClick={() => this.toggleGroupFeeds(false)}
      />
    );
    const expand = (
      <Button
        icon="plus-box"
        title="Expand all groups"
        disabled={this.allGroupsExpanded()}
        onClick={this.expandAllGroups}
      />
    );
    const collapse = (
      <Button
        icon="minus-box"
        title="Collapse all groups"
        disabled={this.allGroupsCollapsed()}
        onClick={this.collapseAllGroups}
      />
    );
    const parentClass = `feed-list ${this.props.className || ''}`;
    const count = this.state.feeds.length;
    const placeholder = count > 0 ? `${count} feeds` : 'loading feeds ...';

    return (
      <div className={parentClass}>
        <div className="feed-list-header">
          <input
            className="filter-input"
            type="search"
            title="Type to filter feeds"
            placeholder={placeholder}
            onChange={this.onFilterChange}
          />
          {grouped ? ungroup : group}
          {grouped ? expand : null}
          {grouped ? collapse : null}
        </div>
        <ul className="feed-list-items">
          {grouped ? this.renderGroups() : this.renderItems()}
        </ul>
      </div>
    );
  }
};
