const React = require('react');
const IconBtn = require('./icon-button.jsx');

module.exports = React.createClass({
  onOpenFeed() {
    return false;
  },

  renderSubscribeBtn() {
    return (
      <IconBtn
        onClick={this.props.onSubscribe}
        icon="add_circle_outline"
        title="Subscribe to this feed"/>
    );
  },

  renderUnsubscribeBtn() {
    return (
      <IconBtn
        onClick={this.props.onUnsubscribe}
        icon="remove_circle_outline"
        title="Unsubscribe from this feed"/>
    );
  },

  render() {
    const { feed, className, onDelete } = this.props;

    return (
      <div className={className}>
        {feed.subscriptionId ? this.renderUnsubscribeBtn() : this.renderSubscribeBtn()}
        <IconBtn
          icon="open_in_new"
          title="Open feed in new window"
          href={feed.link}
          onClick={this.onOpenFeed}
          target="_blank"/>
        <IconBtn
          icon="delete"
          title="Delete this feed"
          onClick={onDelete}
          className="error"/>
      </div>
    );
  }
});
