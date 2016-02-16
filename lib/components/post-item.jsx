'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Button = require('./icon-button.jsx');
const Avatar = require('./text-avatar.jsx');
const Date = require('./date.jsx');
const cls = require('../util').cls;
const Icon = require('./icon.jsx');

module.exports = class PostItemClosed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.scroll) {
      this.props.onScrollIntoView(ReactDOM.findDOMNode(this));
    }
  }

  render() {
    const data = this.props.post;
    const post = data._source.post;
    const read = data._source.read;
    const feedTitle = data._source.title;
    const newIcon = <span className="new-icon">NEW</span>;
    const className = cls(
      'post-item',
      this.props.highlight ? 'highlight' : null,
      read ? null : 'unread'
    );

    return (
      <li onClick={() => this.props.onOpen(data)} className={className}>
        <div className="feed-info">
          <Avatar text={feedTitle}/>
          <div className="title">{feedTitle}</div>
        </div>
        <div className="title">{post.title}</div>
        <div className="actions">
          <Button icon="open-in-new" href={post.link} target="_blank" title="Open in new window"/>
          <Button
            icon="view-carousel"
            onClick={this.props.onOpenInCarousel}
            title="Open in carousel view"
          />
        </div>
        {read ? null : newIcon}
        <Date value={post.date}/>
      </li>
    );
  }
};
