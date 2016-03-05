'use strict';

const React = require('react');
const Button = require('./icon-button.jsx');
const actions = require('../flux/feed-actions');

module.exports = class FeedListHeader extends React.Component {
  constructor(props) {
    super(props);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onAddFeedClick = this.onAddFeedClick.bind(this);
    this.state = { filter: props.filter };
  }

  onFilterChange(event) {
    event.persist();
    this.props.onFilterChange(event);
    this.setState({ filter: event.target.value });
  }

  onAddFeedClick(event) {
    actions.showAddFeedPopup({
      rect: event.target.getBoundingClientRect()
    });
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
          title="Type to filter feeds (examples :new, :latest2h, :latest7d, css)"
          value={this.state.filter}
          placeholder={this.inputPlaceholder()}
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
