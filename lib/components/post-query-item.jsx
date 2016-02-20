'use strict';

const React = require('react');
const Button = require('./icon-button.jsx');
const Avatar = require('./text-avatar.jsx');
const cls = require('../util').cls;
const searchActions = require('../flux/search-actions');
const postActions = require('../flux/post-actions');
const constants = require('../constants');
const highlightDelay = constants.search.POST_QUERY_HIGHLIGHT_DELAY;

module.exports = class PostQueryItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      title: this.props.query.title
    };
    this.onClick = this.onClick.bind(this);
    this.onPin = this.onPin.bind(this);
    this.onUnpin = this.onUnpin.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onTitleBlur = this.onTitleBlur.bind(this);
    this.onTitleKeyDown = this.onTitleKeyDown.bind(this);
    this.onEditStart = this.onEditStart.bind(this);
  }

  highlight(color) {
    clearTimeout(this.timeoutId);

    this.setState({ highlight: color });

    this.timeoutId = setTimeout(() => {
      this.setState({ highlight: false });
    }, highlightDelay);
  }

  cancelEdit() {
    this.setState({ title: this.props.query.title, edit: false });
  }

  confirmEdit() {
    this.setState({ edit: false });
    this.props.onTitleUpdate(this.props.query, this.state.title);
  }

  onEditStart(event) {
    event.stopPropagation();
    this.setState({ edit: true });
  }

  onTitleChange(event) {
    this.setState({ title: event.target.value });
  }

  onTitleBlur() {
    this.confirmEdit();
  }

  onTitleKeyDown(event) {
    if (event.key === 'Enter') {
      this.confirmEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  onPin(event) {
    event.stopPropagation();
    this.highlight('blue');
    this.props.onPin(this.props.query);
  }

  onUnpin(event) {
    event.stopPropagation();
    this.highlight('blue');
    this.props.onUnpin(this.props.query);
  }

  onClick() {
    this.highlight('magenta');
    const query = this.props.query;
    searchActions.selectPostQuery({ data: query });
    postActions.loadPosts(query);
    this.props.onSelect(query);
  }

  render() {
    const query = this.props.query;
    const pin = <Button icon="pin" title="Pin query" onClick={this.onPin}/>;
    const unpin = <Button icon="pin-off" title="Unpin query" onClick={this.onUnpin}/>;
    const pinned = query.pin === 1;
    const title = query.title || query.text;
    const titleClass = query.title ? 'title' : 'text';
    const className = cls(
      'post-query-item',
      pinned ? 'pinned-item' : 'unpinned-item',
      this.state.highlight ? `highlight ${this.state.highlight}-fg` : null
    );
    const titleInput = (
      <input
        autoFocus
        className="edit-input"
        type="text"
        value={this.state.title}
        onClick={event => event.stopPropagation()}
        onChange={this.onTitleChange}
        onBlur={this.onTitleBlur}
        onKeyDown={this.onTitleKeyDown}
        title="Enter a new title then press enter to save or escape to cancel"
      />
    );
    const titleDisplay = (
      <div className={titleClass} title={query.text}>
        {title}
      </div>
    );

    const actions = (
      <div className="actions">
        {pinned ? unpin : pin}
        <Button icon="pencil" onClick={this.onEditStart} title="Edit query title" />
      </div>
    );

    return (
      <li className={className} onClick={this.onClick}>
        <Avatar text={title}/>
        {this.state.edit ? titleInput : titleDisplay}
        {this.state.edit ? null : actions}
      </li>
    );
  }
};
