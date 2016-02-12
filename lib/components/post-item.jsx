'use strict';

const React = require('react');
const getColor = require('../util').getColor;
const getInitials = require('../util').getInitials;
const moment = require('moment');
const cls = require('../util').cls;
const Button = require('./icon-button.jsx');

module.exports = class PostItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const data = this.props.post;
    const post = data._source.post;
    const feedTitle = data._source.title;
    const color = getColor(feedTitle);
    const avatarClass = cls('avatar', `${color}-fg`);
    const className = cls('post-item', this.state.open ? 'open' : 'closed');
    const description = (
      <div
        className="description"
        dangerouslySetInnerHTML={{ __html: post.description }}>
      </div>
    );

    return (
      <li onClick={this.onClick} className={className}>
        <div className="feed-info">
          <div className={avatarClass}>
            <span>{getInitials(feedTitle)}</span>
          </div>
          <div className="title">
            {feedTitle}
          </div>
        </div>
        <div className="title">
          {post.title}
        </div>
        <div className="actions">
          <Button icon="open-in-new" href={post.link} target="_blank" title="Open in new window"/>
          <Button icon="view-carousel" title="Open in carousel view"/>
        </div>
        <div className="date">
          {moment(post.date).fromNow(true)}
        </div>
        {this.state.open ? description : null}
      </li>
    );
  }
};
