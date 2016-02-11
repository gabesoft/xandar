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
    this.state = {};
  }

  render() {
    const data = this.props.post;
    const post = data._source.post;
    const feedTitle = data._source.title;
    const color = getColor(feedTitle);
    const avatarClass = cls('avatar', `${color}-fg`);

    return (
      <li className="post-item">
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
          <Button icon="open-in-new"/>
        </div>
        <div className="date">
          {moment(post.date).fromNow(true)}
        </div>
      </li>
    );
  }
};
