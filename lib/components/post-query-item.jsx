'use strict';

const React = require('react');
const Button = require('./icon-button.jsx');
const Avatar = require('./text-avatar.jsx');
const cls = require('../util').cls;
const timeout = require('../util').timeout;
const searchActions = require('../flux/search-actions');
const postActions = require('../flux/post-actions');

module.exports = class PostQueryItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      title: this.props.query.title,
      pin: this.props.query.pin
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({ highlight: true });

    const query = this.props.query;
    searchActions.selectPostQuery({ data: query });
    searchActions.savePostQuery({ query });
    postActions.loadPosts(query);

    timeout(2000).then(() => this.setState({ highlight: false }));
  }

  render() {
    const query = this.props.query;
    const pin = <Button icon="pin" title="Pin query"/>;
    const unpin = <Button icon="pin-off" title="Unpin query"/>;
    const pinned = this.state.pin !== 0;
    const title = query.title || query.text;
    const titleClass = query.title ? 'title' : 'text';
    const className = cls(
      'post-query-item',
      pinned ? 'pinned-item' : 'unpinned-item',
      this.state.highlight ? 'highlight' : null
    );

    return (
      <li className={className} onClick={this.onClick}>
        <Avatar text={title}/>
        <div className={titleClass} title={query.text}>
          {title}
        </div>
        <div className="actions">
          {pinned ? unpin : pin}
          <Button icon="pencil"/>
        </div>
      </li>
    );
  }
};
