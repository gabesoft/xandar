const React = require('react');
const Transitions = require('react-addons-css-transition-group');

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

  render() {
    const feed = this.props;
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

    return (
      <li className={this.state.className}>
        <div className="collapsible-header" onClick = {this.onHeaderClick}>
          <Transitions
            transitionName="fade-in"
            transitionAppear
            transitionAppearTimeout={300}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300} >
            <div className="title-info truncate">
              <span className="title">{feed.userTitle || feed.title}</span>
              <span className="author hide-on-small-only">{feed.author ? ' - ' + feed.author : ''}</span>
            </div>
            <div className="post-count">
              {feed.newCount ? newBadge() : ''}
              <span className="badge hide-on-small-only">{feed.postCount}</span>
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
