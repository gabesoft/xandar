'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const cls = require('../util').cls;
const Avatar = require('./text-avatar.jsx');
const Date = require('./date.jsx');
const Button = require('./icon-button.jsx');
const Description = require('./post-description.jsx');

module.exports = class PostItemOpen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.onScrollIntoView(ReactDOM.findDOMNode(this));
  }

  renderActions(className, scroll) {
    const data = this.props.post;
    const post = data._source.post;

    return (
      <div className={cls('actions', className)}>
        <Button icon="close" color="red" onClick={() => this.props.onClose(data, scroll)}/>
        <Button icon="open-in-new" href={post.link} target="_blank" title="Open in new window"/>
        <Button
          icon="view-carousel"
          onClick={this.props.onOpenInCarousel}
          title="Open in carousel view"
        />
      </div>
    );
  }

  render() {
    const data = this.props.post;
    const post = data._source.post;
    const feedTitle = data._source.title;

    return (
      <li className="post-item-detail">
        <div onClick={() => this.props.onClose(data)} className="header">
          <div className="feed-info">
            <Avatar text={feedTitle}/>
            <div className="title">{feedTitle}</div>
          </div>
          <div className="title">{post.title}</div>
          {this.renderActions('top')}
          <Date value={post.date}/>
        </div>
        <div className="content">
          <Description post={data}/>
        </div>
        <div onClick={() => this.props.onClose(data, true)} className="footer">
          {this.renderActions('bottom', true)}
        </div>
      </li>
    );
  }
};
