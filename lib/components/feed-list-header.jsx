'use strict';

const React = require('react');
const Button = require('./icon-button.jsx');

module.exports = class FeedListHeader extends React.Component {
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
    const count = this.props.feedCount;
    const placeholder = count > 0 ? `${count} feeds` : 'loading feeds ...';

    return (
      <div className="feed-list-header">
        <input
          className="filter-input"
          type="search"
          title="Type to filter feeds"
          placeholder={placeholder}
          onChange={this.props.onFilterChange}
        />
        {grouped ? expand : null}
        {grouped ? collapse : null}
        {grouped ? ungroup : group}
        <Button
          icon="library-plus"
          color="green"
          title="Add a new feed"
          onClick={this.props.onAddFeed}
        />
      </div>
    );
  }
};
