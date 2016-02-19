'use strict';

const skipQuery = new Set(['unsubscribed', 'uncategorized']);

const React = require('react');
const Button = require('./icon-button.jsx');
const cls = require('../util').cls;
const postActions = require('../flux/post-actions');
const searchActions = require('../flux/search-actions');
const parse = require('../post-query').parse;

module.exports = class FeedGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (skipQuery.has(this.props.group.key)) {
      return;
    }

    const tag = this.props.group.key;
    const query = parse(`#${tag}`);

    query.title = `${tag.replace(/-/g, ' ')} Posts`;
    searchActions.selectPostQuery({ data: query });
    searchActions.savePostQuery({ query });
    postActions.loadPosts(query);
  }

  toggleGroupOpen(open) {
    this.props.onToggleGroupOpen(this.props.group, open);
  }

  render() {
    const group = this.props.group;
    const open = !this.props.closed;
    const expand = (
      <Button
        icon="chevron-right"
        scale="medium"
        onClick={() => this.toggleGroupOpen(true)}
      />
    );
    const collapse = (
      <Button
        icon="chevron-down"
        scale="medium"
        onClick={() => this.toggleGroupOpen(false)}
      />
    );
    const className = cls('feed-group', open ? 'open' : 'closed');

    return (
      <li className={className} onClick={this.onClick}>
        <div className="actions">
          {open ? collapse : expand}
        </div>
        <div className="title">{group.key}</div>
        <div className="item-count">{this.props.count}</div>
      </li>
    );
  }
};
