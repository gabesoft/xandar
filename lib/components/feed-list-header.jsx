'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Button = require('./icon-button.jsx');
const actions = require('../flux/feed-actions');
const makeMruList = require('../mru-list').make;
const debounce = require('../util').debounce;
const Store = require('../store').Store;

module.exports = class FeedListHeader extends React.Component {
  constructor(props) {
    super(props);
    this.store = new Store({ prefix: 'feed-list-header' });
    this.onFilterChange = this.onFilterChange.bind(this);
    this.changeFilter = debounce(this.changeFilter.bind(this), 500);
    this.onAddFeedClick = this.onAddFeedClick.bind(this);
    this.onFilterKeyDown = this.onFilterKeyDown.bind(this);
    this.state = { filter: props.filter };
  }

  changeFilter() {
    const filter = this.state.filter;
    this.props.onFilterChange(filter);
    if (filter.length > 0) {
      this.filterList.add(filter);
      this.store.set('filterList', this.filterList.data);
    }
  }

  updateFilter(filter) {
    ReactDOM.findDOMNode(this.refs.input).value = filter;
    this.setState({ filter }, this.changeFilter);
  }

  onFilterChange(event) {
    event.persist();
    this.setState({ filter: event.target.value.toLowerCase() }, this.changeFilter);
  }

  onFilterKeyDown(event) {
    if (event.key === 'ArrowUp') {
      this.updateFilter(this.filterList.previous());
    } else if (event.key === 'ArrowDown') {
      this.updateFilter(this.filterList.next());
    }
  }

  onAddFeedClick(event) {
    actions.showAddFeedPopup({
      rect: event.target.getBoundingClientRect()
    });
  }

  componentWillMount() {
    this.filterList = makeMruList(this.store.get('filterList') || { capacity: 10 });
  }

  inputPlaceholder() {
    if (this.props.feedCount === 0) {
      return 'loading feeds...';
    } else {
      return `${this.props.subscriptionCount} feeds (type to filter)`;
    }
  }

  render() {
    const grouped = this.props.grouped;

    const group = (
      <Button
        icon="group"
        onClick={() => this.props.toggleGroupFeeds(true)}
        title="Group feeds by first tag"
      />
    );
    const ungroup = (
      <Button
        icon="ungroup"
        title="Ungroup feeds"
        onClick={() => this.props.toggleGroupFeeds(false)}
      />
    );
    const expand = (
      <Button
        icon="plus-box"
        title="Expand all groups"
        disabled={this.props.allGroupsExpanded}
        onClick={this.props.expandAllGroups}
      />
    );
    const collapse = (
      <Button
        icon="minus-box"
        title="Collapse all groups"
        disabled={this.props.allGroupsCollapsed}
        onClick={this.props.collapseAllGroups}
      />
    );

    return (
      <div className="feed-list-header">
        <input
          className="filter-input"
          type="search"
          ref="input"
          title="Type to filter feeds (examples :new, :latest2h, :latest7d, css)"
          value={this.state.filter}
          placeholder={this.inputPlaceholder()}
          onKeyDown={this.onFilterKeyDown}
          onChange={this.onFilterChange}
        />
        {grouped ? expand : null}
        {grouped ? collapse : null}
        {grouped ? ungroup : group}
        <Button
          icon="library-plus"
          color="green"
          title="Add a new feed"
          onClick={this.onAddFeedClick}
        />
      </div>
    );
  }
};
