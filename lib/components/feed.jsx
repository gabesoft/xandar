const React = require('react');
const Transitions = require('react-addons-css-transition-group');
const IconBtn = require('./icon-button.jsx');

module.exports = React.createClass({
  getInitialState() {
    return { open: false, className: 'feed-item' };
  },

  onHeaderClick() {
    const state = {
      open: !this.state.open,
      className: this.state.open ? 'feed-item' : 'feed-item active'
    };
    this.setState(state);
  },

  onSubscribe() {
    this.props.onSubscribe(this.props.feed);
  },

  onUnsubscribe() {
    this.props.onUnsubscribe(this.props.feed);
  },

  onDelete() {
    this.props.onDelete(this.props.feed);
  },

  render() {
    const feed = this.props.feed;
    const body = () => {
      return (
        <div className="collapsible-body">
          <p className="description">{feed.description}</p>
          <p className="uri"><a target="_blank" href={feed.uri}>{feed.uri}</a></p>
        </div>
      );
    };
    const newBadge = () => {
      return (
        <span className="badge new">{feed.newCount}</span>
      );
    };
    const subscribeBtn = () => {
      return (
        <IconBtn
          onClick={this.onSubscribe}
          icon="add_circle_outline"
          title="Subscribe to this feed"/>
      );
    };
    const unsubscribeBtn = () => {
      return (
        <IconBtn
          onClick={this.onUnsubscribe}
          icon="remove_circle_outline"
          title="Unsubscribe from this feed"/>
      );
    };

    return (
      <li className={this.state.className}>
        <div className="collapsible-header">
          <Transitions
            transitionName="fade-in"
            transitionAppear
            transitionAppearTimeout={300}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300} >
            <div className="post-count">
              {feed.newCount ? newBadge() : ''}
              <span className="badge hide-on-small-only">{feed.postCount}</span>
            </div>
            <div className="title-info truncate">
              {feed.subscribed ? unsubscribeBtn() : subscribeBtn()}
              <IconBtn icon="mode_edit" title="Edit this feed"/>
              <IconBtn icon="delete" title="Delete this feed" className="error"/>
              <span className="title" onClick = {this.onHeaderClick}>
                {feed.userTitle || feed.title}
              </span>
              <span className="author hide-on-small-only" onClick = {this.onHeaderClick}>
                {feed.author ? ' - ' + feed.author : ''}
              </span>
            </div>
          </Transitions>
        </div>
        <Transitions
          transitionName="slide-in"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {this.state.open ? body() : ''}
        </Transitions>
      </li>
    );
  }
});
